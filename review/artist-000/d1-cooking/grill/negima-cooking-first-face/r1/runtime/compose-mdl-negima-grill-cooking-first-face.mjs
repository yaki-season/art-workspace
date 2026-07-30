import * as THREE from "/app/node_modules/three/build/three.module.js";
import {
  composeMdlNegimaGrillRaw,
  NEGIMA_GRILL_RAW_TRIANGLES
} from "../../../raw-negima/r1/runtime/compose-mdl-negima-grill-raw.mjs";

export const NEGIMA_GRILL_COOKING_FIRST_FACE_ID = "MDL-NEGIMA-GRILL-COOKING-FIRST-FACE";
export const NEGIMA_GRILL_COOKING_FIRST_FACE_SECONDS = 4;
export const NEGIMA_GRILL_COOKING_FIRST_FACE_TRIANGLES = NEGIMA_GRILL_RAW_TRIANGLES;

const INGREDIENT_TINTS = Object.freeze({
  chicken: new THREE.Color(0xa75b25),
  "green-onion": new THREE.Color(0x504607)
});

function createCookingMaterial(source, { ingredient, cookingFace, heatProgress }) {
  const material = source.clone();
  material.side = THREE.DoubleSide;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uNegimaCookingFace = { value: cookingFace };
    shader.uniforms.uNegimaHeatProgress = { value: heatProgress };
    shader.uniforms.uNegimaSearTint = { value: INGREDIENT_TINTS[ingredient].clone() };
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
uniform float uNegimaCookingFace;
uniform float uNegimaHeatProgress;
uniform vec3 uNegimaSearTint;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
// Pixel-aligned procedural heat mask. The approved albedo remains the only sampled food image.
vec2 negimaCookCell = floor(vMapUv * vec2(48.0, 48.0));
float negimaCookNoise = fract(sin(dot(negimaCookCell, vec2(12.9898, 78.233))) * 43758.5453);
float negimaCookCenter = 1.0 - smoothstep(0.30, 0.82, length(vMapUv - vec2(0.5)) * 1.18);
float negimaVisibleFace = gl_FrontFacing ? 0.0 : 1.0;
float negimaFaceMatch = 1.0 - step(0.25, abs(negimaVisibleFace - uNegimaCookingFace));
float negimaSearClusters = step(0.25, negimaCookNoise) * (0.42 + 0.58 * negimaCookCenter);
float negimaSear = negimaFaceMatch * uNegimaHeatProgress * (0.30 + 0.70 * negimaSearClusters);
diffuseColor.rgb = mix(diffuseColor.rgb, uNegimaSearTint, negimaSear * 0.94);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.48, 0.10), negimaSear * 0.12);`
    );
    material.userData.negimaCookingUniforms = shader.uniforms;
  };
  material.customProgramCacheKey = () => `negima-cooking-first-face-${ingredient}`;
  material.needsUpdate = true;
  return material;
}

function bindCookingMask(component, options) {
  component.traverse((node) => {
    if (!node.isMesh || node.name !== "pixel-material-plane") return;
    node.material = createCookingMaterial(node.material, options);
    node.frustumCulled = false;
  });
}

function setCookingFace(materials, face) {
  if (face !== 0 && face !== 1) throw new Error("cooking face must be 0 or 1");
  for (const material of materials) {
    const uniforms = material.userData.negimaCookingUniforms;
    if (uniforms) uniforms.uNegimaCookingFace.value = face;
  }
}

function setHeatProgress(materials, progress) {
  if (!Number.isFinite(progress) || progress < 0 || progress > 1) {
    throw new Error("heat progress must be a finite value from 0 through 1");
  }
  for (const material of materials) {
    const uniforms = material.userData.negimaCookingUniforms;
    if (uniforms) uniforms.uNegimaHeatProgress.value = progress;
  }
}

/**
 * Builds the first-face cooking state from the approved raw composition.
 * It never writes an albedo or a state sprite: the visible sear is a shader mask over the
 * existing nearest-sampled food albedos. The gameplay domain supplies both face and elapsed time.
 */
export async function composeMdlNegimaGrillCookingFirstFace({
  cookingFace = 0,
  heatProgress = 0.52,
  sideElapsedSeconds = NEGIMA_GRILL_COOKING_FIRST_FACE_SECONDS,
  ...rawOptions
} = {}) {
  if (cookingFace !== 0 && cookingFace !== 1) throw new Error("cookingFace must be 0 or 1");
  if (!Number.isFinite(sideElapsedSeconds) || sideElapsedSeconds < 0 || sideElapsedSeconds >= 8) {
    throw new Error("first-face cooking review must stay in the 0 through <8 second pre-proper interval");
  }
  const raw = await composeMdlNegimaGrillRaw(rawOptions);
  const materials = [];
  const boundComponents = [];
  for (const [index, ingredient] of ["chicken", "green-onion", "chicken", "green-onion", "chicken"].entries()) {
    const component = raw.root.getObjectByName(`${ingredient}-${String(index + 1).padStart(2, "0")}`);
    if (!component) continue;
    bindCookingMask(component, { ingredient, cookingFace, heatProgress });
    boundComponents.push(component.name);
    component.traverse((node) => {
      if (node.isMesh && node.name === "pixel-material-plane") materials.push({ ingredient, material: node.material });
    });
  }

  const state = {
    id: NEGIMA_GRILL_COOKING_FIRST_FACE_ID,
    face: cookingFace,
    stage: "cooking",
    sideElapsedSeconds,
    heatProgress,
    boundComponents,
    materialBindingCount: materials.length
  };
  raw.root.userData.assetId = NEGIMA_GRILL_COOKING_FIRST_FACE_ID;
  raw.root.userData.cookingState = state;
  raw.root.updateMatrixWorld(true);

  return {
    ...raw,
    state,
    setCookingFace: (face) => {
      setCookingFace(materials.map((entry) => entry.material), face);
      state.face = face;
    },
    setHeatProgress: (progress) => {
      setHeatProgress(materials.map((entry) => entry.material), progress);
      state.heatProgress = progress;
    }
  };
}
