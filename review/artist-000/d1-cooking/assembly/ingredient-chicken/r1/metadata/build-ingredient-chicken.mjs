import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../../../../");
const three = await import(pathToFileURL(path.join(root, "app/node_modules/three/build/three.module.js")).href);
const { GLTFExporter } = await import(pathToFileURL(path.join(root, "app/node_modules/three/examples/jsm/exporters/GLTFExporter.js")).href);

class NodeFileReader {
  readAsDataURL(blob) { blob.arrayBuffer().then(buffer => { this.result = `data:application/octet-stream;base64,${Buffer.from(buffer).toString("base64")}`; this.onloadend?.(); }); }
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(buffer => { this.result = buffer; this.onloadend?.(); }); }
}
globalThis.FileReader = NodeFileReader;

const { DoubleSide, Group, Object3D, SphereGeometry, PlaneGeometry, Mesh, MeshBasicMaterial } = three;
const model = new Group();
model.name = "MDL-INGREDIENT-CHICKEN";
const bodyMaterial = new MeshBasicMaterial({ color: 0x73301e });
const textureMaterial = new MeshBasicMaterial({ color: 0xffffff, transparent: true, side: DoubleSide });

const body = new Mesh(new SphereGeometry(0.084, 8, 6), bodyMaterial);
body.name = "chicken-body";
body.scale.set(1.08, 0.96, 0.70);
model.add(body);

const decal = new Mesh(new PlaneGeometry(0.205, 0.205), textureMaterial);
decal.name = "pixel-material-plane";
decal.position.z = 0.060;
model.add(decal);

const socket = new Object3D();
socket.name = "skewerSocket";
socket.position.set(0, 0, 0);
model.add(socket);

function triangles(object) {
  let count = 0;
  object.traverse((node) => {
    if (!node.isMesh) return;
    const index = node.geometry.getIndex();
    count += index ? index.count / 3 : node.geometry.getAttribute("position").count / 3;
  });
  return count;
}

const exporter = new GLTFExporter();
model.updateMatrixWorld(true);
const glb = await new Promise((resolve, reject) => exporter.parse(model, resolve, reject, { binary: true, trs: true, onlyVisible: false }));
const assetDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../assets");
await mkdir(assetDir, { recursive: true });
await writeFile(path.join(assetDir, "mdl-ingredient-chicken-r1.glb"), Buffer.from(glb));

const inspection = {
  id: "MDL-INGREDIENT-CHICKEN",
  format: "glb + external pixel albedo",
  coordinateSystem: "meters, Y-up, +Z front",
  origin: "skewerSocket",
  requiredNodes: ["skewerSocket"],
  materialBinding: { targetNode: "pixel-material-plane", albedo: "tex-ingredient-chicken-albedo-r1.png", sampling: "nearest", colorSpace: "sRGB" },
  cutFaceUV: "pixel-material-plane normalized UV [0,1]×[0,1]",
  boundsMeters: { width: 0.205, height: 0.205, depth: 0.118 },
  triangles: triangles(model),
  triangleBudget: 800,
  status: "within-budget"
};
await writeFile(path.join(assetDir, "mdl-ingredient-chicken-r1.inspection.json"), `${JSON.stringify(inspection, null, 2)}\n`);
console.log(JSON.stringify(inspection));
