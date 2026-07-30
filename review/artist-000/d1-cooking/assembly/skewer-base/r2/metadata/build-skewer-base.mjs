import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../../../../");
const three = await import(pathToFileURL(path.join(root, "app/node_modules/three/build/three.module.js")).href);
const { GLTFExporter } = await import(pathToFileURL(path.join(root, "app/node_modules/three/examples/jsm/exporters/GLTFExporter.js")).href);

class NodeFileReader {
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:application/octet-stream;base64,${Buffer.from(buffer).toString("base64")}`;
      this.onloadend?.();
    });
  }

  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }
}

globalThis.FileReader = NodeFileReader;

const { DoubleSide, Group, Object3D, CylinderGeometry, ConeGeometry, PlaneGeometry, Mesh, MeshBasicMaterial } = three;
const model = new Group();
model.name = "MDL-SKEWER-BASE";
model.position.set(0, 0, 0);
model.quaternion.identity();
model.scale.set(1, 1, 1);

const bamboo = new MeshBasicMaterial({ color: 0x9d5920 });
const bambooLight = new MeshBasicMaterial({ color: 0xd69a40 });
const bambooDark = new MeshBasicMaterial({ color: 0x2a1509 });
const textureSurface = new MeshBasicMaterial({ color: 0xffffff, transparent: true, side: DoubleSide });

function mesh(name, geometry, material) {
  const value = new Mesh(geometry, material);
  value.name = name;
  model.add(value);
  return value;
}

// Local Y is the length axis. The approved pixel decal is on the front plane;
// the low-poly bamboo body remains for depth and non-front-facing interaction.
mesh("bamboo-shaft", new CylinderGeometry(0.018, 0.023, 1.36, 8, 1, false), bamboo);
mesh("bamboo-tip", new ConeGeometry(0.022, 0.115, 8, 1, false), bambooLight).position.y = 0.7375;
mesh("handle-cap", new CylinderGeometry(0.033, 0.029, 0.105, 8, 1, false), bambooDark).position.y = -0.7325;
for (const [index, y] of [-0.60, -0.48].entries()) {
  mesh(`handle-ring-${index + 1}`, new CylinderGeometry(0.027, 0.027, 0.024, 8, 1, false), bambooLight).position.y = y;
}

const decal = mesh("pixel-material-plane", new PlaneGeometry(1.64, 0.1025), textureSurface);
decal.rotation.z = Math.PI / 2;
decal.position.z = 0.035;

function anchor(name, y) {
  const node = new Object3D();
  node.name = name;
  node.position.set(0, y, 0);
  model.add(node);
}

anchor("handle", -0.785);
anchor("tip", 0.795);
for (const [index, y] of [-0.36, -0.18, 0, 0.18, 0.36].entries()) anchor(`slot-${String(index + 1).padStart(2, "0")}`, y);

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
const glb = await new Promise((resolve, reject) => {
  exporter.parse(model, resolve, reject, { binary: true, trs: true, onlyVisible: false });
});

const assetDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../assets");
await mkdir(assetDir, { recursive: true });
await writeFile(path.join(assetDir, "mdl-skewer-base-r2.glb"), Buffer.from(glb));

const inspection = {
  id: "MDL-SKEWER-BASE",
  format: "glb + external pixel albedo",
  coordinateSystem: "meters, Y-up, +Z front",
  origin: "length-axis center",
  requiredNodes: ["handle", "tip"],
  assemblyAnchors: ["slot-01", "slot-02", "slot-03", "slot-04", "slot-05"],
  materialBinding: {
    targetNode: "pixel-material-plane",
    albedo: "tex-skewer-base-albedo-r2.png",
    sampling: "nearest",
    colorSpace: "sRGB"
  },
  boundsMeters: { width: 0.103, height: 1.64, depth: 0.077 },
  triangles: triangles(model),
  triangleBudget: 500,
  status: "within-budget"
};
await writeFile(path.join(assetDir, "mdl-skewer-base-r2.inspection.json"), `${JSON.stringify(inspection, null, 2)}\n`);
console.log(JSON.stringify(inspection));
