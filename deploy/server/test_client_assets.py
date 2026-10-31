import gzip, hashlib, io, json, tarfile, tempfile, unittest
from pathlib import Path
from receive import receive, DeployError


def sha(data):
    return hashlib.sha256(data).hexdigest()


def package(commit='a'*40, content=b'export const value=1;', tamper=None, maps=False, changed_map=False):
    hashes = {'js/bootstrap.js': sha(content)}
    policy = 'c'*64
    version = sha(json.dumps({'policy': policy, 'files': hashes}, separators=(',', ':')).encode())
    base = '_assets/' + sha((policy + ':' + hashes['js/bootstrap.js']).encode()) + '/'
    metadata = {'source_commit': commit, 'config_revision': commit, 'asset_version': version, 'asset_files': hashes, 'asset_urls': {'js/bootstrap.js': base + 'js/bootstrap.js'}, 'asset_format': 'per-file', 'policy_version': policy}
    map_hashes = {}
    if maps:
        for name in ['__release.json','board-calibration.json','camera-controls.js','handoff-protocol.js','index.html','pil-handoff.css','pil-handoff.js','roaming-controller.js'] + [f'map{i}.html' for i in range(10)]:
            data = (name + (' changed' if changed_map and name == 'map0.html' else '')).encode()
            checksum = sha(data)
            map_hashes[name] = checksum
            hashes['3d/' + name] = checksum
            metadata['asset_urls']['3d/' + name] = '_assets/' + sha((policy + ':' + checksum).encode()) + '/3d/' + name
        metadata['asset_files'] = dict(sorted(hashes.items()))
        metadata['asset_version'] = sha(json.dumps({'policy': policy, 'files': metadata['asset_files']}, separators=(',', ':')).encode())
        version = metadata['asset_version']
        metadata['maps3d_version'] = sha(json.dumps(dict(sorted(map_hashes.items())), separators=(',', ':')).encode())
    raw = {'index.html': b'homeMapGrid', 'js/bootstrap.js': content, '__release.json': json.dumps(metadata).encode(), base + 'js/bootstrap.js': content}
    if maps:
        for name in map_hashes:
            raw[metadata['asset_urls']['3d/' + name]] = (name + (' changed' if changed_map and name == 'map0.html' else '')).encode()
        raw['3d/__release.json'] = json.dumps({'component': 'maps-3d', 'source_commit': commit, 'asset_format': 'per-file', 'entry_mode': 'stable', 'asset_version': metadata['maps3d_version'], 'files': map_hashes, 'asset_urls': {name: metadata['asset_urls']['3d/' + name] for name in map_hashes}}).encode()
    files, rows = {}, {}
    for name, data in raw.items():
        files[name] = data
        encodings = {}
        for enc in ['gz', 'br']:
            # The receiver verifies the declared sidecar hash; Node package
            # validation separately performs real gzip and Brotli round trips.
            compressed = gzip.compress(data, mtime=0)
            files[name + '.' + enc] = compressed
            encodings[enc] = {'sha256': sha(compressed), 'bytes': len(compressed)}
        rows[name] = {'sha256': sha(data), 'bytes': len(data), 'cache': 'immutable' if name.startswith('_assets/') else 'metadata' if name in {'__release.json', '3d/__release.json'} else 'entry', 'encodings': encodings}
    inventory = {'schema': 2, 'source_commit': commit, 'policy_version': policy, 'asset_version': version, 'files': rows}
    files['asset-manifest.json'] = json.dumps(inventory).encode()
    if tamper: tamper(files, base)
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode='w:gz') as archive:
        for name, data in files.items():
            info = tarfile.TarInfo(name); info.size = len(data)
            archive.addfile(info, io.BytesIO(data))
    stream.seek(0)
    return stream, base


class ClientAssetTests(unittest.TestCase):
    def test_releases_keep_previous_assets_and_idempotency(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            archive, base = package()
            receive('tactical', archive, root)
            old = (root/'tactical/current').resolve()
            stored = root/'tactical/assets/client'/base.removeprefix('_assets/')/'js/bootstrap.js'
            self.assertEqual(stored.read_bytes(), b'export const value=1;')
            self.assertTrue(receive('tactical', package()[0], root)['no_change'])
            receive('tactical', package('b'*40, b'export const value=2;')[0], root)
            self.assertEqual((root/'tactical/previous').resolve(), old)
            self.assertEqual(stored.read_bytes(), b'export const value=1;')

    def test_invalid_hash_sidecar_and_missing_inventory_do_not_activate(self):
        for tamper in [
            lambda files, base: files.__setitem__(base+'js/bootstrap.js', b'corrupt'),
            lambda files, base: files.__setitem__(base+'js/bootstrap.js.br', b'corrupt'),
            lambda files, base: files.pop('asset-manifest.json'),
            lambda files, base: files.__setitem__(base+'js/unlisted.js', b'undeclared'),
        ]:
            with self.subTest(tamper=tamper), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                receive('tactical', package()[0], root)
                current = (root/'tactical/current').resolve()
                with self.assertRaises(DeployError): receive('tactical', package('b'*40, tamper=tamper)[0], root)
                self.assertEqual((root/'tactical/current').resolve(), current)

    def test_existing_immutable_content_cannot_be_overwritten(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            archive, base = package()
            receive('tactical', archive, root)
            stored = root/'tactical/assets/client'/base.removeprefix('_assets/')/'js/bootstrap.js'
            stored.write_bytes(b'conflict')
            with self.assertRaisesRegex(DeployError, 'immutable-asset-content-conflict'):
                receive('tactical', package('b'*40)[0], root)

    def test_unchanged_maps_retain_target_mtime_and_etag_across_new_releases(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            receive('tactical', package(maps=True)[0], root)
            unchanged = root/'tactical/current/3d/runtime/map1.html'
            changed = root/'tactical/current/3d/runtime/map0.html'
            first_target, first_mtime = unchanged.resolve(), unchanged.stat().st_mtime_ns
            old_changed = changed.resolve()
            receive('tactical', package('b'*40, maps=True, changed_map=True)[0], root)
            self.assertEqual(unchanged.resolve(), first_target)
            self.assertEqual(unchanged.stat().st_mtime_ns, first_mtime)
            self.assertNotEqual(changed.resolve(), old_changed)
            self.assertTrue(receive('tactical', package('b'*40, maps=True, changed_map=True)[0], root)['no_change'])
