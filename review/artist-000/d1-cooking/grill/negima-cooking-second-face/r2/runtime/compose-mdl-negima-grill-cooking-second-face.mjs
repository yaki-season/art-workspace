import * as THREE from "/app/node_modules/three/build/three.module.js";
import {
  composeMdlNegimaGrillRaw,
  NEGIMA_GRILL_RAW_TRIANGLES,
} from "../../../raw-negima/r1/runtime/compose-mdl-negima-grill-raw.mjs";

export const NEGIMA_GRILL_COOKING_SECOND_FACE_ID = "MDL-NEGIMA-GRILL-COOKING-SECOND-FACE";
export const NEGIMA_GRILL_COOKING_SECOND_FACE_TRIANGLES = NEGIMA_GRILL_RAW_TRIANGLES;
export const FIRST_FLIP_RADIANS = Math.PI;

const INGREDIENTS = Object.freeze(["chicken", "green-onion", "chicken", "green-onion", "chicken"]);
const SEAR_TINTS = Object.freeze({
  chicken: new THREE.Color(0x85421f),
  "green-onion": new THREE.Color(0x625624),
});

function createSecondFaceMaterial(source, ingredient, { face0HeatProgress, face1HeatProgress }) {
  const material = source.clone();
  material.side = THREE.DoubleSide;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uNegimaFace0Heat = { value: face0HeatProgress };
    shader.uniforms.uNegimaFace1Heat = { value: face1HeatProgress };
    shader.uniforms.uNegimaSearTint = { value: SEAR_TINTS[ingredient].clone() };
    shader.uniforms.uNegimaIngredientKind = { value: ingredient === "chicken" ? 0 : 1 };
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
uniform float uNegimaFace0Heat;
uniform float uNegimaFace1Heat;
uniform vec3 uNegimaSearTint;
uniform float uNegimaIngredientKind;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
// R2 is instantiated only at the approved PI endpoint, where the reverse decal is the exposed
// second face. Apply the marks to that decal directly: gl_FrontFacing is a winding signal after
// the root transform, not the gameplay face identity.
float negimaHeat = uNegimaFace1Heat;
vec2 negimaFaceUv = floor(vec2(1.0 - vMapUv.x, vMapUv.y) * vec2(16.0, 18.0)) / vec2(16.0, 18.0);
float negimaChickenClusterA = 1.0 - smoothstep(0.095, 0.180, length(negimaFaceUv - vec2(0.30, 0.29)));
float negimaChickenClusterB = 1.0 - smoothstep(0.085, 0.165, length(negimaFaceUv - vec2(0.66, 0.58)));
float negimaChickenClusterC = 1.0 - smoothstep(0.060, 0.125, length(negimaFaceUv - vec2(0.43, 0.76)));
float negimaChickenMarks = max(max(negimaChickenClusterA, negimaChickenClusterB), negimaChickenClusterC * 0.62);
float negimaOnionBandA = (1.0 - smoothstep(0.040, 0.085, abs(negimaFaceUv.y - 0.31))) * smoothstep(0.14, 0.27, negimaFaceUv.x) * (1.0 - smoothstep(0.73, 0.86, negimaFaceUv.x));
float negimaOnionBandB = (1.0 - smoothstep(0.035, 0.075, abs(negimaFaceUv.y - 0.67))) * smoothstep(0.26, 0.39, negimaFaceUv.x) * (1.0 - smoothstep(0.63, 0.76, negimaFaceUv.x));
float negimaOnionMarks = max(negimaOnionBandA, negimaOnionBandB * 0.82);
float negimaFace1Marks = mix(negimaChickenMarks, negimaOnionMarks, uNegimaIngredientKind);
float negimaSharedWarmth = negimaHeat * (0.11 + 0.12 * negimaFace1Marks);
float negimaSignal = negimaFace1Marks * uNegimaFace1Heat;
diffuseColor.rgb = mix(diffuseColor.rgb, uNegimaSearTint, negimaSharedWarmth * 0.42);
diffuseColor.rgb = mix(diffuseColor.rgb, uNegimaSearTint, negimaSignal * 0.78);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.54, 0.18), negimaSignal * (1.0 - uNegimaIngredientKind) * 0.18);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.47, 0.33, 0.10), negimaSignal * uNegimaIngredientKind * 0.16);`,
    );
    material.userData.negimaCookingUniforms = shader.uniforms;
  };
  material.customProgramCacheKey = () => `negima-cooking-second-face-r2-${ingredient}`;
  material.needsUpdate = true;
  return material;
}

function preserveApprovedReverseDecal(component, renderOrder) {
  component.traverse((node) => {
    if (!node.isMesh || node.name !== "pixel-material-plane") return;
    node.material = node.material.clone();
    node.material.side = THREE.DoubleSide;
    node.material.depthTest = false;
    node.material.depthWrite = false;
    node.renderOrder = renderOrder;
    node.frustumCulled = false;
  });
}

function bindSecondFaceSignal(component, ingredient, options) {
  component.traverse((node) => {
    if (!node.isMesh || node.name !== "pixel-material-plane") return;
    node.material = createSecondFaceMaterial(node.material, ingredient, options);
    node.material.depthTest = false;
    node.material.depthWrite = false;
    node.renderOrder = 10;
    node.frustumCulled = false;
  });
}

/**
 * R2 is still the first 180-degree endpoint. Only the visible reverse face's mark distribution
 * changed so it reads at station scale; gameplay owns flip timing and both side histories.
 */
export async function composeMdlNegimaGrillCookingSecondFace({
  face0ElapsedSeconds = 4,
  face1ElapsedSeconds = 4,
  face0HeatProgress = 0.52,
  face1HeatProgress = 0.52,
  ...rawOptions
} = {}) {
  for (const value of [face0ElapsedSeconds, face1ElapsedSeconds]) {
    if (!Number.isFinite(value) || value < 0 || value >= 8) throw new Error("second-face cooking review must retain its 0 through <8 second pre-proper interval");
  }
  if (face0ElapsedSeconds !== 4 || face1ElapsedSeconds !== 4 || face0HeatProgress !== 0.52 || face1HeatProgress !== 0.52) {
    throw new Error("R2 fixes the approved 4-second per-face / 0.52 heat snapshot; this shader must not imply a later cook stage");
  }

  const raw = await composeMdlNegimaGrillRaw(rawOptions);
  preserveApprovedReverseDecal(raw.base, 5);
  const boundComponents = [];
  let materialBindingCount = 0;
  for (const [index, ingredient] of INGREDIENTS.entries()) {
    const name = `${ingredient}-${String(index + 1).padStart(2, "0")}`;
    const component = raw.root.getObjectByName(name);
    if (!component) throw new Error(`missing approved raw component ${name}`);
    bindSecondFaceSignal(component, ingredient, { face0HeatProgress, face1HeatProgress });
    boundComponents.push(name);
    component.traverse((node) => { if (node.isMesh && node.name === "pixel-material-plane") materialBindingCount += 1; });
  }

  raw.flipPivot.rotation.y = FIRST_FLIP_RADIANS;
  raw.flipPivot.userData.face = 1;
  const state = {
    id: NEGIMA_GRILL_COOKING_SECOND_FACE_ID,
    sourceRevision: 2,
    completedFlips: 1,
    rotationY: FIRST_FLIP_RADIANS,
    visibleFace: 1,
    stage: "cooking",
    face0ElapsedSeconds,
    face1ElapsedSeconds,
    face0HeatProgress,
    face1HeatProgress,
    face1Signal: { chickenClusters: 3, greenOnionBands: 2, coarseUvCells: [16, 18], signalOnlyOnVisibleFace: true },
    boundComponents,
    materialBindingCount,
  };
  raw.root.userData.assetId = NEGIMA_GRILL_COOKING_SECOND_FACE_ID;
  raw.root.userData.cookingState = state;
  raw.root.updateMatrixWorld(true);
  return { ...raw, state };
}
