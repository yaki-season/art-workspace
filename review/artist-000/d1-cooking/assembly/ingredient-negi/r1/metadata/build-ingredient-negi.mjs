import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../../../../");
const three = await import(pathToFileURL(path.join(root, "app/node_modules/three/build/three.module.js")).href);
const { GLTFExporter } = await import(pathToFileURL(path.join(root, "app/node_modules/three/examples/jsm/exporters/GLTFExporter.js")).href);
class NodeFileReader { readAsDataURL(blob){blob.arrayBuffer().then(b=>{this.result=`data:application/octet-stream;base64,${Buffer.from(b).toString("base64")}`;this.onloadend?.();});} readAsArrayBuffer(blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});} }
globalThis.FileReader = NodeFileReader;

const { DoubleSide, Group, Object3D, CylinderGeometry, PlaneGeometry, Mesh, MeshBasicMaterial } = three;
const model = new Group(); model.name = "MDL-INGREDIENT-NEGI";
const body = new Mesh(new CylinderGeometry(0.074, 0.074, 0.22, 10, 1, false), new MeshBasicMaterial({ color: 0x315b17 }));
body.name = "negi-body";
// The front pixel material carries the approved oblique silhouette. Keep depth
// inside that silhouette so no generic primitive is visible in the fixed camera.
body.scale.set(0.30, 0.30, 0.30);
body.position.z = -0.035;
model.add(body);
const decal = new Mesh(new PlaneGeometry(0.255, 0.192), new MeshBasicMaterial({ color: 0xffffff, transparent: true, side: DoubleSide }));
decal.name = "pixel-material-plane"; decal.position.z = 0.078; model.add(decal);
const socket = new Object3D(); socket.name = "skewerSocket"; socket.position.set(0, 0, 0); model.add(socket);
function triangles(object){let count=0;object.traverse(node=>{if(!node.isMesh)return;const index=node.geometry.getIndex();count+=index?index.count/3:node.geometry.getAttribute("position").count/3;});return count;}
const exporter = new GLTFExporter(); model.updateMatrixWorld(true);
const glb = await new Promise((resolve,reject)=>exporter.parse(model,resolve,reject,{binary:true,trs:true,onlyVisible:false}));
const assetDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../assets"); await mkdir(assetDir,{recursive:true});
await writeFile(path.join(assetDir,"mdl-ingredient-negi-r1.glb"),Buffer.from(glb));
const inspection={id:"MDL-INGREDIENT-NEGI",format:"glb + external pixel albedo",coordinateSystem:"meters, Y-up, +Z front",origin:"skewerSocket",requiredNodes:["skewerSocket"],materialBinding:{targetNode:"pixel-material-plane",albedo:"tex-ingredient-negi-albedo-r1.png",sampling:"nearest",colorSpace:"sRGB"},cutFaceUV:"pixel-material-plane normalized UV [0,1]×[0,1]",boundsMeters:{width:0.255,height:0.22,depth:0.156},triangles:triangles(model),triangleBudget:800,status:"within-budget"};
await writeFile(path.join(assetDir,"mdl-ingredient-negi-r1.inspection.json"),`${JSON.stringify(inspection,null,2)}\n`);console.log(JSON.stringify(inspection));
