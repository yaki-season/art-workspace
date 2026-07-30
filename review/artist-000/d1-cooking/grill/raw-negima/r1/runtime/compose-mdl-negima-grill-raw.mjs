import * as THREE from "/app/node_modules/three/build/three.module.js";
import { GLTFLoader } from "/app/node_modules/three/examples/jsm/loaders/GLTFLoader.js";

export const NEGIMA_GRILL_RAW_ID = "MDL-NEGIMA-GRILL-RAW";
export const NEGIMA_GRILL_RAW_SEQUENCE = ["chicken", "green-onion", "chicken", "green-onion", "chicken"];
export const NEGIMA_GRILL_RAW_INGREDIENT_SCALE = 1.4;
export const NEGIMA_GRILL_RAW_TRIANGLES = 476;

const sourceUrl = (value) => new URL(value, import.meta.url).href;

export const DEFAULT_NEGIMA_GRILL_RAW_SOURCES = Object.freeze({
  baseModel: sourceUrl("../../../../assembly/skewer-base/r2/assets/mdl-skewer-base-r2.glb"),
  baseAlbedo: sourceUrl("../../../../assembly/skewer-base/r2/assets/tex-skewer-base-albedo-r2.png"),
  chickenModel: sourceUrl("../../../../assembly/ingredient-chicken/r1/assets/mdl-ingredient-chicken-r1.glb"),
  chickenAlbedo: sourceUrl("../../../../assembly/ingredient-chicken/r1/assets/tex-ingredient-chicken-albedo-r1.png"),
  negiModel: sourceUrl("../../../../assembly/ingredient-negi/r3/assets/mdl-ingredient-negi-r3.glb"),
  negiAlbedo: sourceUrl("../../../../assembly/ingredient-negi/r3/assets/tex-ingredient-negi-albedo-r3.png")
});

function loadTexture(loader, url) {
  return new Promise((resolve, reject) => loader.load(url, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    resolve(texture);
  }, undefined, reject));
}

function loadModel(loader, url) {
  return new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject));
}

function bindNearestPixelAlbedo(gltf, albedo) {
  const root = gltf.scene;
  const decal = root.getObjectByName("pixel-material-plane");
  if (!decal?.isMesh) throw new Error("pixel-material-plane is required for a negima source model");
  decal.material = decal.material.clone();
  decal.material.map = albedo;
  decal.material.needsUpdate = true;
  root.traverse((node) => { if (node.isMesh) node.frustumCulled = false; });
  return root;
}

/**
 * Builds the D1 raw negima strictly from the approved GLB and albedo inputs.
 * No texture is redrawn, resampled, color-adjusted, or baked into a new model.
 * The skewer length axis stays local +Y, so flipPivot.rotation.y is its real flip axis.
 */
export async function composeMdlNegimaGrillRaw({
  sources = DEFAULT_NEGIMA_GRILL_RAW_SOURCES,
  gltfLoader = new GLTFLoader(),
  textureLoader = new THREE.TextureLoader(),
  skewerScale = 1
} = {}) {
  const [baseTexture, chickenTexture, negiTexture, baseFile, chickenFile, negiFile] = await Promise.all([
    loadTexture(textureLoader, sources.baseAlbedo),
    loadTexture(textureLoader, sources.chickenAlbedo),
    loadTexture(textureLoader, sources.negiAlbedo),
    loadModel(gltfLoader, sources.baseModel),
    loadModel(gltfLoader, sources.chickenModel),
    loadModel(gltfLoader, sources.negiModel)
  ]);

  const root = new THREE.Group();
  root.name = "grillNegimaRoot";
  root.userData.assetId = NEGIMA_GRILL_RAW_ID;

  const flipPivot = new THREE.Group();
  flipPivot.name = "flipPivot";
  flipPivot.userData.axis = "+Y skewer length axis";
  flipPivot.userData.face = 0;
  root.add(flipPivot);

  const base = bindNearestPixelAlbedo(baseFile, baseTexture);
  base.name = "approvedSkewerBase";
  base.scale.setScalar(skewerScale);
  // Unlike the assembly jig, the grill keeps the local +Y skewer axis screen-vertical.
  base.rotation.z = 0;
  flipPivot.add(base);

  const chicken = bindNearestPixelAlbedo(chickenFile, chickenTexture);
  const negi = bindNearestPixelAlbedo(negiFile, negiTexture);
  const sourceByIngredient = { chicken, "green-onion": negi };
  for (const [index, ingredient] of NEGIMA_GRILL_RAW_SEQUENCE.entries()) {
    const component = sourceByIngredient[ingredient].clone(true);
    component.name = `${ingredient}-${String(index + 1).padStart(2, "0")}`;
    component.scale.setScalar(NEGIMA_GRILL_RAW_INGREDIENT_SCALE);
    const slot = base.getObjectByName(`slot-${String(index + 1).padStart(2, "0")}`);
    if (!slot) throw new Error(`missing approved skewer slot ${index + 1}`);
    slot.add(component);
  }

  root.updateMatrixWorld(true);
  return { root, flipPivot, base };
}

/**
 * The caller owns timing and the domain transition. This returns absolute visual endpoints:
 * first valid click: 0 -> PI (face 0 to face 1), second: PI -> 2PI (face 1 to face 0).
 */
export function nextFlipTargetRadians(completedFlipCount) {
  if (!Number.isInteger(completedFlipCount) || completedFlipCount < 0) {
    throw new Error("completedFlipCount must be a non-negative integer");
  }
  return (completedFlipCount + 1) * Math.PI;
}

export function faceAfterCompletedFlips(completedFlipCount) {
  return completedFlipCount % 2;
}
