import hashlib, io, json, tarfile, tempfile, unittest
from pathlib import Path
from receive import receive, DeployError

class MapsReceiverTests(unittest.TestCase):
    def package(self, commit='a'*40, bad=False, changed=False, stable=False):
        files = {'index.html': b'homeMapGrid', 'js/bootstrap.js': b'export {}'}
        runtime = {n: ('changed' if changed else n).encode() for n in ['__release.json','board-calibration.json','camera-controls.js','handoff-protocol.js','index.html','pil-handoff.css','pil-handoff.js','roaming-controller.js'] + [f'map{i}.html' for i in range(10)]}
        hashes = {n:hashlib.sha256(v).hexdigest() for n,v in sorted(runtime.items())}
        version = hashlib.sha256(json.dumps(hashes,separators=(',',':')).encode()).hexdigest()
        files['__release.json'] = json.dumps({'source_commit':commit,'config_revision':commit,'maps3d_version':version}).encode()
        files['3d/__release.json'] = json.dumps({'source_commit':commit,'asset_version':version,'component':'maps-3d','files':hashes,'entry_mode':'stable' if stable else 'redirect'}).encode()
        for n,v in runtime.items():
            base='3d/releases/'+version+'/'+n
            for suffix in ['', '.gz', '.br']: files[base+suffix]=v
            if n.endswith('.html') and not stable: files['3d/'+n]=b'entry'
        if bad: files['3d/releases/'+version+'/index.html']=b'corrupt'
        stream=io.BytesIO()
        with tarfile.open(fileobj=stream,mode='w:gz') as tar:
            for name,data in files.items():
                info=tarfile.TarInfo(name);info.size=len(data);tar.addfile(info,io.BytesIO(data))
        stream.seek(0)
        return stream,version
    def test_stable_runtime_pointer_is_derived_and_idempotent(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            archive,version=self.package(stable=True)
            receive('tactical',archive,root)
            link=root/'tactical/current/3d/runtime'
            self.assertTrue(link.is_symlink())
            self.assertEqual((link/'index.html').read_bytes(),b'index.html')
            archive,_=self.package(stable=True)
            self.assertTrue(receive('tactical',archive,root)['no_change'])

    def test_atomic_versions_and_hash_rejection(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            archive,v1=self.package()
            result=receive('tactical',archive,root)
            current=(root/'tactical/current').resolve()
            self.assertTrue(result['ok'])
            self.assertTrue((root/'tactical/assets'/v1/'index.html').is_file())
            archive,_=self.package('b'*40,bad=True)
            with self.assertRaisesRegex(DeployError,'invalid-maps-manifest'):receive('tactical',archive,root)
            self.assertEqual((root/'tactical/current').resolve(),current)
            archive,v2=self.package('c'*40,changed=True)
            receive('tactical',archive,root)
            self.assertEqual((root/'tactical/previous').resolve(),current)
            self.assertTrue((root/'tactical/assets'/v1/'index.html').is_file())
            self.assertTrue((root/'tactical/assets'/v2/'index.html').is_file())
            archive,_=self.package('d'*40)
            (root/'tactical/assets'/v1/'index.html').write_bytes(b'conflict')
            with self.assertRaisesRegex(DeployError,'immutable-asset-content-conflict'):receive('tactical',archive,root)

if __name__=='__main__':unittest.main()
