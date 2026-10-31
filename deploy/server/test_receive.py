import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from receive import DeployError, receive


def archive(commit='a' * 40, extra=None, metadata=None, index='<h1 id="hero-title">PIL</h1>'):
    files = [('index.html', index.encode()), ('__release.json', json.dumps(metadata or {'homepage_commit': commit}).encode()), ('ownership.txt', b'ownership')]
    files += extra or []
    output = io.BytesIO()
    with tarfile.open(fileobj=output, mode='w:gz') as tar:
        for name, value in files:
            entry = tarfile.TarInfo(name)
            if isinstance(value, tarfile.TarInfo):
                tar.addfile(value)
            else:
                entry.size = len(value)
                tar.addfile(entry, io.BytesIO(value))
    output.seek(0)
    return output


class ReceiverTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name) / 'site'

    def tearDown(self):
        self.temporary.cleanup()

    def test_atomic_activation_previous_release_and_idempotence(self):
        first = receive('home', archive(), self.root)
        current = self.root / 'home/current'
        original = current.resolve()
        self.assertEqual((current / 'ownership.txt').read_bytes(), b'ownership')
        self.assertEqual((current / 'index.html').stat().st_mode & 0o777, 0o644)
        second = receive('home', archive('b' * 40), self.root)
        self.assertNotEqual(first['release'], second['release'])
        self.assertEqual((self.root / 'home/previous').resolve(), original)
        self.assertTrue(receive('home', archive('b' * 40), self.root)['no_change'])

    def test_attacks_cannot_modify_the_active_release_or_escape_storage(self):
        receive('home', archive(), self.root)
        original = (self.root / 'home/current').resolve()
        cases = [[('../outside.txt', b'bad')], [('/outside.txt', b'bad')], [('.env', b'bad')], [('run.py', b'bad')], [('ownership.txt', b'duplicate')]]
        for kind in [tarfile.SYMTYPE, tarfile.LNKTYPE, tarfile.FIFOTYPE]:
            entry = tarfile.TarInfo('link.txt')
            entry.type, entry.linkname = kind, '/etc/passwd'
            cases.append([('link.txt', entry)])
        for additions in cases:
            with self.subTest(additions=additions):
                with self.assertRaises(DeployError):
                    receive('home', archive('b' * 40, extra=additions), self.root)
                self.assertEqual((self.root / 'home/current').resolve(), original)
        self.assertFalse((self.root / 'outside.txt').exists())

    def test_a_commit_cannot_be_overwritten_with_different_content(self):
        receive('home', archive(), self.root)
        with self.assertRaisesRegex(DeployError, 'release-content-conflict'):
            receive('home', archive(index='<h1 id="hero-title">changed</h1>'), self.root)
        self.assertIn('PIL', (self.root / 'home/current/index.html').read_text())

    def test_component_keys_cannot_publish_the_other_component(self):
        tactical = {'source_commit': 'a' * 40, 'config_revision': 'b' * 40}
        with self.assertRaises(DeployError):
            receive('home', archive(metadata=tactical, index='<div id="homeMapGrid"></div>'), self.root)
        result = receive('tactical', archive(metadata=tactical, index='<div id="homeMapGrid"></div>', extra=[('js/bootstrap.js', b'export {};')]), self.root)
        self.assertEqual(result['component'], 'tactical')
        self.assertFalse((self.root / 'home/current').exists())

    def test_retention_keeps_current_previous_and_unrelated_directories(self):
        directory = self.root / 'home/releases'
        directory.mkdir(parents=True)
        unrelated = directory / 'operator-backup'
        unrelated.mkdir()
        for index in range(8):
            receive('home', archive(f'{index:040x}'), self.root)
        self.assertTrue((self.root / 'home/current/index.html').exists())
        self.assertTrue((self.root / 'home/previous/index.html').exists())
        self.assertTrue(unrelated.exists())
        self.assertLessEqual(len(list(directory.glob('home-*'))), 5)


if __name__ == '__main__':
    unittest.main()
