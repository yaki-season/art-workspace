import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../../../../../');
const three = await import(pathToFileURL(path.join(root, 'app/node_modules/three/build/three.module.js')).href);
const { GLTFExporter } = await import(pathToFileURL(path.join(root, 'app/node_modules/three/examples/jsm/exporters/GLTFExporter.js')).href);

class NodeFileReader {
  readAsDataURL(blob) { blob.arrayBuffer().then((b) => { this.result = `data:application/octet-stream;base64,${Buffer.from(b).toString('base64')}`; this.onloadend?.(); }); }
  readAsArrayBuffer(blob) { blob.arrayBuffer().then((b) => { this.result = b; this.onloadend?.(); }); }
}
globalThis.FileReader = NodeFileReader;

const { DoubleSide, Group, Object3D, CylinderGeometry, PlaneGeometry, Mesh, MeshBasicMaterial } = three;
const model = new Group();
model.name = 'MDL-INGREDIENT-NEGI';

// R4: 대파의 길이축(local Y)을 꼬치 관통축(local Y)과 평행하게 둔다.
// 부모 꼬치가 Z=-90°로 눕는 실제 assembly pose에서 대파도 화면 가로 방향이 된다.
const body = new Mesh(new CylinderGeometry(0.074, 0.074, 0.22, 10, 1, false), new MeshBasicMaterial({ color: 0x315b17 }));
body.name = 'negi-body';
body.scale.set(0.30, 0.30, 0.30);
body.position.z = -0.035;
model.add(body);

const decal = new Mesh(new PlaneGeometry(0.255, 0.192), new MeshBasicMaterial({ color: 0xffffff, transparent: true, side: DoubleSide }));
decal.name = 'pixel-material-plane';
decal.position.z = 0.078;
decal.rotation.z = 64 * Math.PI / 180;
model.add(decal);

const socket = new Object3D();
socket.name = 'skewerSocket';
model.add(socket);

const exporter = new GLTFExporter();
model.updateMatrixWorld(true);
const glb = await new Promise((resolve, reject) => exporter.parse(model, resolve, reject, { binary: true, trs: true, onlyVisible: false }));
const assetDir = path.resolve(here, '../assets');
await mkdir(assetDir, { recursive: true });
await writeFile(path.join(assetDir, 'mdl-ingredient-negi-r4.glb'), Buffer.from(glb));
await copyFile(path.resolve(here, '../../r3/assets/tex-ingredient-negi-albedo-r3.png'), path.join(assetDir, 'tex-ingredient-negi-albedo-r4.png'));
await writeFile(path.join(assetDir, 'mdl-ingredient-negi-r4.inspection.json'), `${JSON.stringify({
  id: 'MDL-INGREDIENT-NEGI',
  sourceRevision: 4,
  coordinateSystem: 'meters, Y-up, +Z front',
  origin: 'skewerSocket',
  skewerAxis: 'local +Y',
  bodyLongAxis: 'local +Y; parallel to skewer axis',
  assemblyPose: 'parent Z=-90deg makes the negi body horizontal on screen',
  requiredNodes: ['skewerSocket'],
  triangles: 42,
  triangleBudget: 800,
  status: 'review-candidate',
}, null, 2)}\n`);
