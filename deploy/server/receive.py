#!/usr/bin/env python3
"""Validate and atomically activate one component's static release."""
import fcntl
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import tarfile
import tempfile
import uuid

MAX_ARCHIVE = 24 * 1024 * 1024
TACTICAL_ARCHIVE = 700 * 1024 * 1024
MAX_EXPANDED = 64 * 1024 * 1024
MAX_FILE = 10 * 1024 * 1024
MAX_ENTRIES = 3000
EXTENSIONS = {'.html', '.css', '.js', '.json', '.webp', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2', '.ico', '.txt'}
TEXT_EXTENSIONS = {'.html', '.css', '.js', '.json', '.svg', '.txt'}
SHA = re.compile(r'^[a-f0-9]{40}$')
ASSET_SHA = re.compile(r'^[a-f0-9]{64}$')


class DeployError(Exception):
    pass


def release_name(component, metadata):
    if component == 'home':
        commit = metadata.get('homepage_commit', '')
        if not isinstance(commit, str) or not SHA.fullmatch(commit):
            raise DeployError('invalid-home-metadata')
        return 'home-' + commit
    if component == 'tactical':
        source, config = metadata.get('source_commit', ''), metadata.get('config_revision', '')
        if any(not isinstance(value, str) or not SHA.fullmatch(value) for value in [source, config]):
            raise DeployError('invalid-tactical-metadata')
        return 'tactical-' + source + '-' + config
    raise DeployError('invalid-component')


def safe_path(name):
    path = PurePosixPath(name)
    if path.is_absolute() or '\\' in name or len(name.encode('utf8')) > 240:
        raise DeployError('invalid-archive-path')
    if len(path.parts) > 12 or any(part == '..' or part.startswith('.') for part in path.parts):
        raise DeployError('invalid-archive-path')
    return path


def atomic_json(path, value):
    temporary = path.parent / ('.metadata-' + uuid.uuid4().hex)
    temporary.write_text(json.dumps(value, sort_keys=True) + '\n')
    temporary.chmod(0o644)
    os.replace(temporary, path)


def tree_manifest(directory):
    result = {}
    metadata = json.loads((directory / '__release.json').read_text())
    maps_version = metadata.get('maps3d_version')
    for path in directory.rglob('*'):
        if path.is_symlink():
            relative = path.relative_to(directory).as_posix()
            if metadata.get('asset_format') == 'per-file' and relative.startswith('3d/runtime/'):
                name = relative.removeprefix('3d/runtime/')
                suffix = Path(name).suffix if name.endswith(('.gz', '.br')) else ''
                raw = name[:-len(suffix)] if suffix else name
                asset = metadata.get('asset_urls', {}).get('3d/' + raw, '')
                expected = directory.parent.parent / 'assets/client' / asset.removeprefix('_assets/')
                if asset and os.readlink(path) == str(expected) + suffix:
                    continue
                raise DeployError('invalid-existing-release')
            if (path.relative_to(directory).as_posix() == '3d/runtime'
                    and isinstance(maps_version, str) and ASSET_SHA.fullmatch(maps_version)
                    and os.readlink(path) == 'releases/' + maps_version):
                continue  # Receiver-generated link; archive symlinks are still forbidden.
            raise DeployError('invalid-existing-release')
        if path.is_file():
            result[path.relative_to(directory).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


def point_symlink(path, target):
    temporary = path.parent / ('.pointer-' + uuid.uuid4().hex)
    temporary.symlink_to(target)
    os.replace(temporary, path)


def validate_assets(component, metadata, manifest):
    assets = metadata.get('assets', {})
    if not isinstance(assets, dict):
        raise DeployError('invalid-assets-metadata')
    raw_assets = set()
    for name in manifest:
        path = PurePosixPath(name)
        if path.suffix in {'.gz', '.br'} and path.with_suffix('').as_posix() not in manifest:
            raise DeployError('orphan-compressed-file')
        if not path.parts or path.parts[0] != '_static':
            continue
        if component != 'home' or len(path.parts) < 3 or not ASSET_SHA.fullmatch(path.parts[1]):
            raise DeployError('invalid-immutable-asset-path')
        if path.suffix not in {'.gz', '.br'}:
            if manifest[name] != path.parts[1]:
                raise DeployError('immutable-asset-hash-mismatch')
            raw_assets.add('/' + name)
    for original, versioned in assets.items():
        if not isinstance(original, str) or not original.startswith('/') or original.startswith('//') or not isinstance(versioned, str):
            raise DeployError('invalid-assets-metadata')
        safe_path(original[1:])
        if original[1:] not in manifest or versioned not in raw_assets or not versioned.endswith(original):
            raise DeployError('invalid-assets-metadata')
    if set(assets.values()) != raw_assets:
        raise DeployError('invalid-assets-metadata')



def validate_maps(component, metadata, manifest, staging):
    names = [name for name in manifest if name.startswith('3d/')]
    version = metadata.get('maps3d_version')
    if not names and version is None:
        return  # Allow existing 2D releases during receiver rollout and rollback.
    if component != 'tactical' or not isinstance(version, str) or not ASSET_SHA.fullmatch(version):
        raise DeployError('invalid-maps-version')
    try:
        maps = json.loads((staging / '3d/__release.json').read_text())
        files = maps['files']
        assert maps['source_commit'] == metadata['source_commit']
        assert maps['asset_version'] == version and maps['component'] == 'maps-3d'
        assert isinstance(files, dict) and len(files) == 18
        assert all(isinstance(n, str) and '/' not in n and re.fullmatch(r'[a-z0-9_.-]+', n) and isinstance(h, str) and ASSET_SHA.fullmatch(h) for n,h in files.items())
        assert sum(n.endswith('.html') for n in files) == 11 and 'index.html' in files
        assert hashlib.sha256(json.dumps(dict(sorted(files.items())), separators=(',', ':')).encode()).hexdigest() == version
        expected = {'3d/__release.json'}
        if metadata.get('asset_format') == 'per-file':
            expected.update({'3d/__release.json.gz', '3d/__release.json.br'})
            assert maps.get('asset_format') == 'per-file' and set(names) == expected
            for name, checksum in files.items():
                assert metadata['asset_files']['3d/' + name] == checksum
                assert maps['asset_urls'][name] == metadata['asset_urls']['3d/' + name]
                assert manifest[maps['asset_urls'][name]] == checksum
            return
        for name, checksum in files.items():
            path = '3d/releases/' + version + '/' + name
            assert manifest.get(path) == checksum
            expected.update({path, path + '.gz', path + '.br'})
            if name.endswith('.html') and maps.get('entry_mode') != 'stable':
                expected.add('3d/' + name)
        assert set(names) == expected
    except (AssertionError, KeyError, TypeError, ValueError, OSError):
        raise DeployError('invalid-maps-manifest') from None


def validate_client_assets(component, metadata, manifest, staging):
    names = {name for name in manifest if name.startswith('_assets/')}
    version = metadata.get('asset_version')
    if not names and version is None:
        return  # Previous releases remain valid rollback candidates.
    try:
        assert component == 'tactical' and isinstance(version, str) and ASSET_SHA.fullmatch(version)
        policy_version, files = metadata['policy_version'], metadata['asset_files']
        assert isinstance(policy_version, str) and ASSET_SHA.fullmatch(policy_version)
        assert isinstance(files, dict) and 1 <= len(files) <= 1000
        assert metadata['asset_format'] == 'per-file' and set(metadata['asset_urls']) == set(files)
        assert hashlib.sha256(json.dumps({'policy': policy_version, 'files': dict(sorted(files.items()))}, separators=(',', ':')).encode()).hexdigest() == version
        expected = set()
        for name, checksum in files.items():
            assert isinstance(name, str) and isinstance(checksum, str) and ASSET_SHA.fullmatch(checksum)
            safe_path(name)
            assert name.split('/')[0] in {'js', 'css', 'locales', 'telemetry', '3d'}
            identity = hashlib.sha256((policy_version + ':' + checksum).encode()).hexdigest()
            path = '_assets/' + identity + '/' + name
            assert metadata['asset_urls'][name] == path
            assert manifest.get(path) == checksum
            expected.update({path, path + '.gz', path + '.br'})
        assert names == expected
        inventory = json.loads((staging / 'asset-manifest.json').read_text())
        assert inventory['schema'] == 2 and inventory['policy_version'] == policy_version
        assert inventory['source_commit'] == metadata['source_commit'] and inventory['asset_version'] == version
        records = inventory['files']
        raw = {n for n in manifest if not n.endswith(('.gz', '.br')) and n != 'asset-manifest.json'}
        assert set(records) == raw
        for name, row in records.items():
            assert row['sha256'] == manifest[name] and row['bytes'] == (staging / name).stat().st_size
            expected_cache = 'immutable' if name.startswith(('_assets/', '3d/releases/')) else 'metadata' if name in {'__release.json', '3d/__release.json'} else 'entry'
            assert row['cache'] == expected_cache
            assert set(row['encodings']) == {'gz', 'br'}
            for encoding, details in row['encodings'].items():
                assert details['sha256'] == manifest[name + '.' + encoding]
                assert details['bytes'] == (staging / (name + '.' + encoding)).stat().st_size
    except (AssertionError, KeyError, TypeError, ValueError, OSError):
        raise DeployError('invalid-client-asset-manifest') from None


def publish_assets(component_dir, release, manifest):
    names = [name for name in manifest if name.startswith(('_static/', '_assets/', '3d/releases/'))]
    if not names:
        return
    storage = component_dir / 'assets'
    if storage.is_symlink() or storage.exists() and not storage.is_dir():
        raise DeployError('invalid-asset-storage')
    storage.mkdir(mode=0o755, exist_ok=True)
    planned = []
    for name in sorted(names):
        relative = ('client',) + PurePosixPath(name).parts[1:] if name.startswith('_assets/') else PurePosixPath(name).parts[1:] if name.startswith('_static/') else PurePosixPath(name).parts[2:]
        parent = storage
        for part in relative[:-1]:
            parent = parent / part
            if parent.is_symlink() or parent.exists() and not parent.is_dir():
                raise DeployError('invalid-asset-storage')
        target = storage.joinpath(*relative)
        if target.is_symlink() or target.exists() and (not target.is_file() or hashlib.sha256(target.read_bytes()).hexdigest() != manifest[name]):
            raise DeployError('immutable-asset-content-conflict')
        planned.append((name, target))
    for name, target in planned:
        target.parent.mkdir(mode=0o755, parents=True, exist_ok=True)
        if not target.exists():
            # A hard link survives pruning of its release and never overwrites a cached URL.
            os.link(release / name, target)


def receive(component, stream, root=Path('/srv/pkuidv')):
    if component not in {'home', 'tactical'}:
        raise DeployError('invalid-component')
    component_dir = root / component
    releases = component_dir / 'releases'
    releases.mkdir(mode=0o755, parents=True, exist_ok=True)
    if releases.is_symlink() or component_dir.is_symlink():
        raise DeployError('invalid-storage-path')
    with (component_dir / '.deploy.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        staging = Path(tempfile.mkdtemp(prefix='.stage-', dir=releases))
        descriptor, upload_name = tempfile.mkstemp(prefix='.upload-', dir=releases)
        upload = Path(upload_name)
        try:
            compressed = 0
            with os.fdopen(descriptor, 'wb') as target:
                while True:
                    data = stream.read(65536)
                    if not data:
                        break
                    compressed += len(data)
                    if compressed > (TACTICAL_ARCHIVE if component == 'tactical' else MAX_ARCHIVE):
                        raise DeployError('archive-too-large')
                    target.write(data)
            manifest, seen = {}, set()
            expanded = entries = 0
            with tarfile.open(upload, 'r:gz') as archive:
                for member in archive:
                    entries += 1
                    if entries > MAX_ENTRIES:
                        raise DeployError('too-many-files')
                    path = safe_path(member.name)
                    if str(path) == '.':
                        if not member.isdir():
                            raise DeployError('invalid-archive-root')
                        continue
                    relative = path.as_posix()
                    if relative in seen:
                        raise DeployError('duplicate-archive-path')
                    seen.add(relative)
                    target = staging.joinpath(*path.parts)
                    if member.isdir():
                        target.mkdir(mode=0o755, parents=True, exist_ok=True)
                        continue
                    if not member.isfile() or member.sparse is not None:
                        raise DeployError('links-and-special-files-forbidden')
                    compressed_text = path.suffix in {'.gz', '.br'} and path.with_suffix('').suffix.lower() in TEXT_EXTENSIONS
                    if (path.suffix.lower() not in EXTENSIONS and not compressed_text) or member.size < 0 or member.size > (80 * 1024 * 1024 if component == 'tactical' and (relative.startswith('3d/releases/') or re.fullmatch(r'_assets/[a-f0-9]{64}/3d/[a-z0-9_.-]+', relative)) else MAX_FILE):
                        raise DeployError('invalid-static-file')
                    expanded += member.size
                    if expanded > (1024 * 1024 * 1024 if component == 'tactical' else MAX_EXPANDED):
                        raise DeployError('expanded-archive-too-large')
                    target.parent.mkdir(mode=0o755, parents=True, exist_ok=True)
                    content = archive.extractfile(member)
                    if content is None:
                        raise DeployError('invalid-archive-data')
                    digest, written = hashlib.sha256(), 0
                    with target.open('xb') as output:
                        while True:
                            data = content.read(65536)
                            if not data:
                                break
                            written += len(data)
                            if written > member.size:
                                raise DeployError('invalid-archive-size')
                            digest.update(data)
                            output.write(data)
                    if written != member.size:
                        raise DeployError('invalid-archive-size')
                    target.chmod(0o644)
                    manifest[relative] = digest.hexdigest()
            if 'index.html' not in manifest or '__release.json' not in manifest:
                raise DeployError('missing-entry-files')
            try:
                metadata = json.loads((staging / '__release.json').read_text())
            except (ValueError, UnicodeError):
                raise DeployError('invalid-release-json') from None
            if not isinstance(metadata, dict):
                raise DeployError('invalid-release-json')
            release = release_name(component, metadata)
            index = (staging / 'index.html').read_text()
            if component == 'home' and ('hero-title' not in index or 'homeMapGrid' in index):
                raise DeployError('wrong-home-entry')
            if component == 'tactical' and ('homeMapGrid' not in index or 'js/bootstrap.js' not in manifest):
                raise DeployError('wrong-tactical-entry')
            validate_assets(component, metadata, manifest)
            validate_maps(component, metadata, manifest, staging)
            validate_client_assets(component, metadata, manifest, staging)
            for name in manifest:
                if PurePosixPath(name).suffix in {'.gz', '.br'}:
                    original = staging / str(PurePosixPath(name).with_suffix(''))
                    modified = original.stat().st_mtime_ns
                    os.utime(staging / name, ns=(modified, modified))
            if metadata.get('maps3d_version'):
                # Both 2D and stable 3D URLs follow the same atomic current pointer.
                if metadata.get('asset_format') == 'per-file':
                    runtime = staging / '3d/runtime'
                    runtime.mkdir()
                    maps = json.loads((staging / '3d/__release.json').read_text())
                    for name, url in maps['asset_urls'].items():
                        target = component_dir / 'assets/client' / url.removeprefix('_assets/')
                        for suffix in ['', '.gz', '.br']:
                            (runtime / (name + suffix)).symlink_to(str(target) + suffix)
                else:
                    (staging / '3d/runtime').symlink_to('releases/' + metadata['maps3d_version'])
            final = releases / release
            if final.exists():
                if not final.is_dir() or final.is_symlink() or tree_manifest(final) != manifest:
                    raise DeployError('release-content-conflict')
            else:
                staging.chmod(0o755)
                os.replace(staging, final)
            current = component_dir / 'current'
            if current.exists() and not current.is_symlink():
                raise DeployError('invalid-current-pointer')
            previous = current.resolve() if current.is_symlink() else None
            if previous and (previous.parent != releases.resolve() or not previous.is_dir()):
                raise DeployError('invalid-current-pointer')
            if component in {'home', 'tactical'}:
                publish_assets(component_dir, final, manifest)
            if previous and previous != final:
                point_symlink(component_dir / 'previous', previous.relative_to(component_dir))
            point_symlink(current, final.relative_to(component_dir))
            atomic_json(component_dir / 'deployment.json', {'component': component, 'release': release, **metadata})
            valid_release = re.compile(r'^' + component + r'-[a-f0-9]{40}' + (r'-[a-f0-9]{40}' if component == 'tactical' else '') + '$')
            candidates = sorted((p for p in releases.iterdir() if p.is_dir() and not p.is_symlink() and valid_release.fullmatch(p.name)), key=lambda p: p.stat().st_mtime, reverse=True)
            protected = {final, previous}
            for old in candidates[5:]:
                if old not in protected and old.resolve().parent == releases.resolve():
                    shutil.rmtree(old)
            return {'ok': True, 'component': component, 'release': release, 'files': len(manifest), 'no_change': previous == final}
        finally:
            upload.unlink(missing_ok=True)
            if staging.exists():
                shutil.rmtree(staging)


