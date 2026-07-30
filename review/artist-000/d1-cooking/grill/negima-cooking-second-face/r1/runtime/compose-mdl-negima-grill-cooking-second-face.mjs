import * as THREE from "/app/node_modules/three/build/three.module.js";
import {
  composeMdlNegimaGrillRaw,
  NEGIMA_GRILL_RAW_TRIANGLES
} from "../../../raw-negima/r1/runtime/compose-mdl-negima-grill-raw.mjs";

export const NEGIMA_GRILL_COOKING_SECOND_FACE_ID = "MDL-NEGIMA-GRILL-COOKING-SECOND-FACE";
export const NEGIMA_GRILL_COOKING_SECOND_FACE_TRIANGLES = NEGIMA_GRILL_RAW_TRIANGLES;
export const FIRST_FLIP_RADIANS = Math.PI;

const INGREDIENT_TINTS = Object.freeze({
  chicken: new THREE.Color(0xa75b25),
  "green-onion": new THREE.Color(0x504607)
});

function createCookingMaterial(source, { ingredient, face0HeatProgress, face1HeatProgress }) {
  const material = source.clone();
  material.side = THREE.DoubleSide;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uNegimaFace0Heat = { value: face0HeatProgress };
    shader.uniforms.uNegimaFace1Heat = { value: face1HeatProgress };
    shader.uniforms.uNegimaSearTint = { value: INGREDIENT_TINTS[ingredient].clone() };
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
uniform float uNegimaFace0Heat;
uniform float uNegimaFace1Heat;
uniform vec3 uNegimaSearTint;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
// The approved raw albedo is the only food texture. This mask derives each side's sear separately.
float negimaVisibleFace = gl_FrontFacing ? 0.0 : 1.0;
float negimaHeatProgress = mix(uNegimaFace0Heat, uNegimaFace1Heat, negimaVisibleFace);
vec2 negimaCookCell = floor(vMapUv * vec2(48.0, 48.0));
float negimaCookNoise = fract(sin(dot(negimaCookCell + negimaVisibleFace * vec2(17.0, 29.0), vec2(12.9898, 78.233))) * 43758.5453);
float negimaCookCenter = 1.0 - smoothstep(0.30, 0.82, length(vMapUv - vec2(0.5)) * 1.18);
float negimaSearClusters = step(0.25, negimaCookNoise) * (0.42 + 0.58 * negimaCookCenter);
float negimaSear = negimaHeatProgress * (0.30 + 0.70 * negimaSearClusters);
diffuseColor.rgb = mix(diffuseColor.rgb, uNegimaSearTint, negimaSear * 0.94);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.48, 0.10), negimaSear * 0.12);`
    );
    material.userData.negimaCookingUniforms = shader.uniforms;
  };
  material.customProgramCacheKey = () => `negima-cooking-second-face-${ingredient}`;
  material.needsUpdate = true;
  return material;
}

function bindCookingMask(component, options) {
  component.traverse((node) => {
    if (!node.isMesh || node.name !== "pixel-material-plane") return;
    node.material = createCookingMaterial(node.material, options);
    // The approved source keeps a plain backing mesh behind its pixel decal. At the PI endpoint
    // that backing would otherwise hide the same approved albedo from the reverse view. Render
    // the approved double-sided decal after its backing instead of inventing a rear texture.
    node.material.depthTest = false;
    node.material.depthWrite = false;
    node.renderOrder = 10;
    node.frustumCulled = false;
  });
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

/**
 * Builds the state after the first 180° flip. Face 0's completed heat remains in the render
 * snapshot while the visible face 1 has its own current cooking value. Domain timers and quality
 * transitions stay outside this renderer.
 */
export async function composeMdlNegimaGrillCookingSecondFace({
  face0ElapsedSeconds = 4,
  face1ElapsedSeconds = 4,
  face0HeatProgress = 0.52,
  face1HeatProgress = 0.52,
  ...rawOptions
} = {}) {
  for (const value of [face0ElapsedSeconds, face1ElapsedSeconds]) {
    if (!Number.isFinite(value) || value < 0 || value >= 8) {
      throw new Error("second-face cooking review must keep each face inside the 0 through <8 second pre-proper interval");
    }
  }
  for (const value of [face0HeatProgress, face1HeatProgress]) {
    if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error("heat progress must be from 0 through 1");
  }

  const raw = await composeMdlNegimaGrillRaw(rawOptions);
  preserveApprovedReverseDecal(raw.base, 5);
  const boundComponents = [];
  let materialBindingCount = 0;
  for (const [index, ingredient] of ["chicken", "green-onion", "chicken", "green-onion", "chicken"].entries()) {
    const component = raw.root.getObjectByName(`${ingredient}-${String(index + 1).padStart(2, "0")}`);
    if (!component) throw new Error(`missing approved raw component ${ingredient}-${String(index + 1).padStart(2, "0")}`);
    bindCookingMask(component, { ingredient, face0HeatProgress, face1HeatProgress });
    boundComponents.push(component.name);
    component.traverse((node) => {
      if (node.isMesh && node.name === "pixel-material-plane") materialBindingCount += 1;
    });
  }

  raw.flipPivot.rotation.y = FIRST_FLIP_RADIANS;
  raw.flipPivot.userData.face = 1;
  const state = {
    id: NEGIMA_GRILL_COOKING_SECOND_FACE_ID,
    completedFlips: 1,
    rotationY: FIRST_FLIP_RADIANS,
    visibleFace: 1,
    stage: "cooking",
    face0ElapsedSeconds,
    face1ElapsedSeconds,
    face0HeatProgress,
    face1HeatProgress,
    boundComponents,
    materialBindingCount
  };
  raw.root.userData.assetId = NEGIMA_GRILL_COOKING_SECOND_FACE_ID;
  raw.root.userData.cookingState = state;
  raw.root.updateMatrixWorld(true);
  return {...raw,state};
}
