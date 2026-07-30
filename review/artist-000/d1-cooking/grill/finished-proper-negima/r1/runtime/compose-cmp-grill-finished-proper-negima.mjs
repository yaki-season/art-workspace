import {composeMdlNegimaGrillProperSecondFace,NEGIMA_GRILL_PROPER_SECOND_FACE_TRIANGLES} from "../../../negima-proper-second-face/r1/runtime/compose-mdl-negima-grill-proper-second-face.mjs";

export const GRILL_FINISHED_PROPER_NEGIMA_ID="CMP-GRILL-FINISHED-PROPER-NEGIMA";
export const GRILL_FINISHED_TRAY_ID="ST-GRILL-FINISHED-TRAY";
export const GRILL_FINISHED_TRAY_ASSET="../../../finished-tray/r1/assets/st-grill-finished-tray-fhd-r1.png";
export const GRILL_FINISHED_TRAY_PLACEMENT=Object.freeze({x:1534,y:130,width:218,height:342});
export const GRILL_FINISHED_PROPER_NEGIMA_TRIANGLES=NEGIMA_GRILL_PROPER_SECOND_FACE_TRIANGLES;

/**
 * Moves an already approved proper negima from the grill into the finished tray. Quality, order
 * assignment and serving remain domain responsibilities; this render state has no heat contact.
 */
export async function composeGrillFinishedProperNegima({skewerScale=180,...properOptions}={}){
  const proper=await composeMdlNegimaGrillProperSecondFace({skewerScale,...properOptions});
  const state={
    id:GRILL_FINISHED_PROPER_NEGIMA_ID,
    stage:"finished",
    contactFace:null,
    completionQuality:"Perfect",
    foodCount:1,
    foodItem:"negima",
    completedFlips:proper.state.completedFlips,
    rotationY:proper.state.rotationY,
    visibleFace:proper.state.visibleFace,
    face0ElapsedSeconds:proper.state.face0ElapsedSeconds,
    face1ElapsedSeconds:proper.state.face1ElapsedSeconds,
    materialBindingCount:proper.state.materialBindingCount,
    boundComponents:proper.state.boundComponents,
    triangleCount:GRILL_FINISHED_PROPER_NEGIMA_TRIANGLES,
    staticTray:{id:GRILL_FINISHED_TRAY_ID,asset:GRILL_FINISHED_TRAY_ASSET,placement:GRILL_FINISHED_TRAY_PLACEMENT}
  };
  proper.root.userData.assetId=GRILL_FINISHED_PROPER_NEGIMA_ID;
  proper.root.userData.cookingState=state;
  proper.root.updateMatrixWorld(true);
  return {...proper,state};
}
