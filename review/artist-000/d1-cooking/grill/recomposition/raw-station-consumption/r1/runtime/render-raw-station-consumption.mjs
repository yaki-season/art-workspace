import * as THREE from "/app/node_modules/three/build/three.module.js";
import { composeMdlNegimaGrillRaw, NEGIMA_GRILL_RAW_TRIANGLES } from "../../../../raw-negima/r1/runtime/compose-mdl-negima-grill-raw.mjs";

export const RAW_STATION_SLOT0 = Object.freeze({ x: 0.297, y: 0.435, width: 0.041, height: 0.27 });
export const RAW_STATION_CAMERA = Object.freeze({
  sourceMasterId: "CM-GRILL-STATION-QUEUED-SELECTION",
  sourceRevision: 3,
  projection: "screen-space orthographic overlay aligned to the approved master-derived base",
  modelPose: "screen-vertical skewer with a shallow station-facing 3/4 compensation",
  rootRotationRadians: { x: -0.035, y: 0.055, z: 0 }
});

function applyStationRawMaterialTuning(root) {
  root.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      // Texture pixels remain byte-identical. This is only a scene-light color multiplier.
      if (material.color) material.color.setRGB(1.0, 0.94, 0.86);
      material.side = THREE.DoubleSide;
      material.needsUpdate = true;
    }
  });
}

export async function renderRawStationConsumption({ canvas, width, height }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, preserveDrawingBuffer: true });
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, width, height, 0, 0.1, 100);
  camera.position.z = 50;

  const scale = width / 1920;
  // The approved model's root is intentionally bottom-biased. These values fill the
  // Developer 1 slot0 visual rect without changing its asset pixels or composition.
  const { root, flipPivot } = await composeMdlNegimaGrillRaw({ skewerScale: 178 * scale });
  // Orthographic screen space maps Three.js +Y upward, hence `height - visualCenterY`.
  root.position.set(609.6 * scale, 464.4 * scale, 0);
  root.scale.set(1.45, 1, 1);
  root.rotation.set(RAW_STATION_CAMERA.rootRotationRadians.x, RAW_STATION_CAMERA.rootRotationRadians.y, RAW_STATION_CAMERA.rootRotationRadians.z);
  applyStationRawMaterialTuning(root);
  scene.add(root);
  scene.updateMatrixWorld(true);
  renderer.render(scene, camera);

  const visualRect = {
    x: RAW_STATION_SLOT0.x * width,
    y: RAW_STATION_SLOT0.y * height,
    width: RAW_STATION_SLOT0.width * width,
    height: RAW_STATION_SLOT0.height * height
  };
  const state = {
    id: "MDL-NEGIMA-GRILL-RAW",
    sourceRevision: 1,
    triangleCount: NEGIMA_GRILL_RAW_TRIANGLES,
    flipPivot: { axis: "local +Y", rotationY: flipPivot.rotation.y, firstInput: "0->PI", secondInput: "PI->2PI" },
    gameplay: { frontElapsedSec: 0, backElapsedSec: 0, contactFace: null, qualityOwner: "game domain" },
    camera: RAW_STATION_CAMERA,
    visualRect,
    renderer: { newRaster: false, newGlb: false, newTexture: false, nearestAlbedosReused: true }
  };
  return { renderer, scene, camera, root, flipPivot, state };
}
