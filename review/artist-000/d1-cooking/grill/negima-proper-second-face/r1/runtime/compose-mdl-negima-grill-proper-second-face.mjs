import * as THREE from "/app/node_modules/three/build/three.module.js";
import {composeMdlNegimaGrillRaw,NEGIMA_GRILL_RAW_TRIANGLES} from "../../../raw-negima/r1/runtime/compose-mdl-negima-grill-raw.mjs";

export const NEGIMA_GRILL_PROPER_SECOND_FACE_ID="MDL-NEGIMA-GRILL-PROPER-SECOND-FACE";
export const NEGIMA_GRILL_PROPER_SECOND_FACE_TRIANGLES=NEGIMA_GRILL_RAW_TRIANGLES;
export const NEGIMA_GRILL_PROPER_SECOND_FACE_SECONDS=8;
export const FIRST_FLIP_RADIANS=Math.PI;

// Use the user-approved first-face proper palette on the opposite face as well.
const TINTS=Object.freeze({chicken:new THREE.Color(0xa27c63),"green-onion":new THREE.Color(0x68713a)});

function properMaterial(source,ingredient){
  const material=source.clone();material.side=THREE.DoubleSide;
  material.onBeforeCompile=(shader)=>{
    shader.uniforms.uNegimaProperTint={value:TINTS[ingredient].clone()};
    shader.fragmentShader=shader.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uNegimaProperTint;`);
    shader.fragmentShader=shader.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
// The approved raw albedo remains the only food texture. Both 8-second faces receive this proper mask.
vec2 negimaCell=floor(vMapUv*vec2(48.0,48.0));
float negimaNoise=fract(sin(dot(negimaCell,vec2(12.9898,78.233)))*43758.5453);
float negimaCenter=1.0-smoothstep(0.26,0.85,length(vMapUv-vec2(0.5))*1.18);
float negimaRoast=(0.64+0.36*step(0.10,negimaNoise))*(0.82+0.18*negimaCenter);
float negimaChar=step(0.84,negimaNoise)*smoothstep(0.18,0.72,negimaCenter);
float negimaGloss=step(0.982,negimaNoise)*smoothstep(0.26,0.64,negimaCenter);
diffuseColor.rgb=mix(diffuseColor.rgb,uNegimaProperTint,negimaRoast*0.88);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.30,0.20,0.13),negimaChar*0.20);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.78,0.65,0.48),negimaGloss*0.05);`);
    material.userData.negimaProperUniforms=shader.uniforms;
  };
  material.customProgramCacheKey=()=>`negima-proper-second-face-${ingredient}`;material.needsUpdate=true;return material;
}

function bindProperMask(component,ingredient){
  component.traverse((node)=>{
    if(!node.isMesh||node.name!=="pixel-material-plane")return;
    node.material=properMaterial(node.material,ingredient);
    // At the π endpoint, preserve the approved reverse food decal above the source backing mesh.
    node.material.depthTest=false;node.material.depthWrite=false;node.renderOrder=10;node.frustumCulled=false;
  });
}

function preserveApprovedReverseDecal(component,renderOrder){
  component.traverse((node)=>{
    if(!node.isMesh||node.name!=="pixel-material-plane")return;
    node.material=node.material.clone();node.material.side=THREE.DoubleSide;
    node.material.depthTest=false;node.material.depthWrite=false;node.renderOrder=renderOrder;node.frustumCulled=false;
  });
}

/** Both sides are proper at exactly 8 seconds; the first 180° flip exposes face 1. */
export async function composeMdlNegimaGrillProperSecondFace({face0ElapsedSeconds=NEGIMA_GRILL_PROPER_SECOND_FACE_SECONDS,face1ElapsedSeconds=NEGIMA_GRILL_PROPER_SECOND_FACE_SECONDS,...rawOptions}={}){
  if(face0ElapsedSeconds!==8||face1ElapsedSeconds!==8)throw new Error("this isolated proper-second-face review is the exact 8s face-0 / 8s face-1 endpoint");
  const raw=await composeMdlNegimaGrillRaw(rawOptions);preserveApprovedReverseDecal(raw.base,5);
  const boundComponents=[];let materialBindingCount=0;
  for(const [index,ingredient] of ["chicken","green-onion","chicken","green-onion","chicken"].entries()){
    const name=`${ingredient}-${String(index+1).padStart(2,"0")}`,component=raw.root.getObjectByName(name);if(!component)throw new Error(`missing approved raw component ${name}`);
    bindProperMask(component,ingredient);boundComponents.push(name);component.traverse((node)=>{if(node.isMesh&&node.name==="pixel-material-plane")materialBindingCount+=1;});
  }
  raw.flipPivot.rotation.y=FIRST_FLIP_RADIANS;raw.flipPivot.userData.face=1;
  const state={id:NEGIMA_GRILL_PROPER_SECOND_FACE_ID,completedFlips:1,rotationY:FIRST_FLIP_RADIANS,visibleFace:1,stage:"proper",face0ElapsedSeconds,face1ElapsedSeconds,boundComponents,materialBindingCount};
  raw.root.userData.assetId=NEGIMA_GRILL_PROPER_SECOND_FACE_ID;raw.root.userData.cookingState=state;raw.root.updateMatrixWorld(true);return {...raw,state};
}
