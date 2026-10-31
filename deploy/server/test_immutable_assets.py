import gzip
import hashlib
import io
from pathlib import Path
import tempfile
import unittest

from receive import DeployError, receive
from test_receive import archive


def asset_archive(commit='a' * 40, content=b'body { color: red; }' * 50):
    digest = hashlib.sha256(content).hexdigest()
    path = '_static/' + digest + '/styles.css'
    files = [('styles.css', content), (path, content), (path + '.gz', gzip.compress(content, mtime=0))]
    metadata = {'homepage_commit': commit, 'assets': {'/styles.css': '/' + path}}
    return archive(commit, extra=files, metadata=metadata), path, content


class ImmutableAssetTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name) / 'site'

    def tearDown(self):
        self.temporary.cleanup()

    def test_old_urls_survive_release_pruning_and_repeated_deployments(self):
        first, path, original = asset_archive()
        receive('home', first, self.root)
        stored = self.root / 'home/assets' / path.removeprefix('_static/')
        inode = stored.stat().st_ino
        for index in range(1, 8):
            payload, _, _ = asset_archive(f'{index:040x}', f'body {{ color: #{index:06x}; }}'.encode())
            receive('home', payload, self.root)
        self.assertFalse((self.root / ('home/releases/home-' + 'a' * 40)).exists())
        self.assertEqual(stored.read_bytes(), original)
        self.assertEqual(gzip.decompress(Path(str(stored) + '.gz').read_bytes()), original)
        self.assertEqual(stored.stat().st_ino, inode)
        payload, _, _ = asset_archive('f' * 40)
        receive('home', payload, self.root)
        self.assertEqual(stored.stat().st_ino, inode)

    def test_invalid_hashes_or_metadata_cannot_activate(self):
        receive('home', archive(), self.root)
        previous = (self.root / 'home/current').resolve()
        bad = '_static/' + '0' * 64 + '/styles.css'
        for files, assets in [
            ([(bad, b'invalid')], {'/styles.css': '/' + bad}),
            ([('_static/not-a-hash/styles.css', b'bad')], {}),
        ]:
            with self.assertRaises(DeployError):
                receive('home', archive('b' * 40, extra=files, metadata={'homepage_commit': 'b' * 40, 'assets': assets}), self.root)
            self.assertEqual((self.root / 'home/current').resolve(), previous)

    def test_compressed_files_must_have_an_allowed_text_original(self):
        for name in ['run.py.gz', 'run.py.br', 'image.png.gz', 'orphan.css.gz', 'orphan.css.br']:
            with self.subTest(name=name), self.assertRaises(DeployError):
                receive('home', archive(extra=[(name, b'bad')]), self.root)
        receive('home', archive(extra=[('index.html.gz', gzip.compress(b'<h1 id="hero-title">PIL</h1>', mtime=0))]), self.root)

    def test_existing_cached_files_are_never_overwritten_on_conflict(self):
        payload, path, _ = asset_archive()
        receive('home', payload, self.root)
        previous = (self.root / 'home/current').resolve()
        stored = self.root / 'home/assets' / path.removeprefix('_static/')
        # Replace the store entry without modifying the release's hard-linked original.
        stored.unlink()
        stored.write_bytes(b'operator-conflict')
        payload, _, _ = asset_archive('b' * 40)
        with self.assertRaisesRegex(DeployError, 'immutable-asset-content-conflict'):
            receive('home', payload, self.root)
        self.assertEqual(stored.read_bytes(), b'operator-conflict')
        self.assertEqual((self.root / 'home/current').resolve(), previous)

    def test_asset_store_symlinks_are_rejected(self):
        (self.root / 'home').mkdir(parents=True)
        outside = self.root / 'outside'
        outside.mkdir()
        (self.root / 'home/assets').symlink_to(outside)
        payload, _, _ = asset_archive()
        with self.assertRaisesRegex(DeployError, 'invalid-asset-storage'):
            receive('home', payload, self.root)
        self.assertFalse((self.root / 'home/current').exists())
        self.assertEqual(list(outside.iterdir()), [])


if __name__ == '__main__':
    unittest.main()
