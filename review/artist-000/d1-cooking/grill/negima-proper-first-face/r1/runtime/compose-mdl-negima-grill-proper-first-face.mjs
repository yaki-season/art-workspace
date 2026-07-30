import * as THREE from "/app/node_modules/three/build/three.module.js";
import {composeMdlNegimaGrillRaw,NEGIMA_GRILL_RAW_TRIANGLES} from "../../../raw-negima/r1/runtime/compose-mdl-negima-grill-raw.mjs";

export const NEGIMA_GRILL_PROPER_FIRST_FACE_ID="MDL-NEGIMA-GRILL-PROPER-FIRST-FACE";
export const NEGIMA_GRILL_PROPER_FIRST_FACE_TRIANGLES=NEGIMA_GRILL_RAW_TRIANGLES;
export const NEGIMA_GRILL_PROPER_FIRST_FACE_SECONDS=8;

// Proper means roasted chicken brown, not the amber pre-proper colour used by the 4 second state.
const TINTS=Object.freeze({chicken:new THREE.Color(0x5b2e13),"green-onion":new THREE.Color(0x4d4c09)});

function properMaterial(source,ingredient){
  const material=source.clone();material.side=THREE.DoubleSide;
  material.onBeforeCompile=(shader)=>{
    shader.uniforms.uNegimaProperFace={value:0};shader.uniforms.uNegimaProperTint={value:TINTS[ingredient].clone()};
    shader.fragmentShader=shader.fragmentShader.replace("#include <common>",`#include <common>
uniform float uNegimaProperFace;
uniform vec3 uNegimaProperTint;`);
    shader.fragmentShader=shader.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
// Proper cooking: preserve the approved albedo and derive a roasted-brown surface with restrained oil gloss.
float negimaVisibleFace=gl_FrontFacing?0.0:1.0;
float negimaFaceMatch=1.0-step(0.25,abs(negimaVisibleFace-uNegimaProperFace));
vec2 negimaCell=floor(vMapUv*vec2(48.0,48.0));
float negimaNoise=fract(sin(dot(negimaCell,vec2(12.9898,78.233)))*43758.5453);
float negimaCenter=1.0-smoothstep(0.26,0.85,length(vMapUv-vec2(0.5))*1.18);
float negimaRoast=negimaFaceMatch*(0.68+0.32*step(0.14,negimaNoise))*(0.78+0.22*negimaCenter);
float negimaChar=negimaFaceMatch*step(0.66,negimaNoise)*smoothstep(0.12,0.76,negimaCenter);
float negimaGloss=negimaFaceMatch*step(0.972,negimaNoise)*smoothstep(0.24,0.68,negimaCenter);
diffuseColor.rgb=mix(diffuseColor.rgb,uNegimaProperTint,negimaRoast*0.96);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.22,0.09,0.025),negimaChar*0.34);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.74,0.34,0.09),negimaGloss*0.08);`);
    material.userData.negimaProperUniforms=shader.uniforms;
  };
  material.customProgramCacheKey=()=>`negima-proper-first-face-${ingredient}`;material.needsUpdate=true;return material;
}

function bindProperMask(component,ingredient){component.traverse((node)=>{if(!node.isMesh||node.name!=="pixel-material-plane")return;node.material=properMaterial(node.material,ingredient);node.frustumCulled=false;});}

/** The first side is proper at exactly 8 seconds; face 1 has not been heated and remains raw. */
export async function composeMdlNegimaGrillProperFirstFace({face0ElapsedSeconds=NEGIMA_GRILL_PROPER_FIRST_FACE_SECONDS,face1ElapsedSeconds=0,...rawOptions}={}){
  if(face0ElapsedSeconds!==8||face1ElapsedSeconds!==0)throw new Error("this isolated proper-first-face review is the exact 8s face-0 / 0s face-1 endpoint");
  const raw=await composeMdlNegimaGrillRaw(rawOptions);const boundComponents=[];let materialBindingCount=0;
  for(const [index,ingredient] of ["chicken","green-onion","chicken","green-onion","chicken"].entries()){
    const name=`${ingredient}-${String(index+1).padStart(2,"0")}`,component=raw.root.getObjectByName(name);if(!component)throw new Error(`missing approved raw component ${name}`);
    bindProperMask(component,ingredient);boundComponents.push(name);component.traverse((node)=>{if(node.isMesh&&node.name==="pixel-material-plane")materialBindingCount+=1;});
  }
  raw.flipPivot.rotation.y=0;raw.flipPivot.userData.face=0;
  const state={id:NEGIMA_GRILL_PROPER_FIRST_FACE_ID,completedFlips:0,rotationY:0,visibleFace:0,stage:"proper",face0ElapsedSeconds,face1ElapsedSeconds,boundComponents,materialBindingCount};
  raw.root.userData.assetId=NEGIMA_GRILL_PROPER_FIRST_FACE_ID;raw.root.userData.cookingState=state;raw.root.updateMatrixWorld(true);return {...raw,state};
}
