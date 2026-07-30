import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const workspace=path.resolve(root,"../../../../../../..");
const {chromium}=(await import(pathToFileURL(path.join(workspace,"app/node_modules/@playwright/test/index.js")).href)).default;
const browser=await chromium.launch({headless:true,args:["--use-angle=swiftshader","--use-gl=angle","--enable-unsafe-swiftshader"]});
try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  page.on("pageerror",error=>console.error(`browser-pageerror:${error.message}`));
  await page.goto("http://127.0.0.1:8011/art-workspace/review/artist-000/d1-cooking/grill/negima-cooking-second-face/r1/review-mdl-negima-grill-cooking-second-face-fhd-r1.html");
  await page.waitForFunction(()=>document.body.dataset.ready==="true");
  const state=await page.evaluate(()=>window.__negimaCookingSecondFaceReview.state());
  if(state.completedFlips!==1||state.visibleFace!==1||Math.abs(state.rotationY-Math.PI)>1e-6)throw new Error("review must show the endpoint of the first 180 degree flip / face 1");
  if(state.face0ElapsedSeconds!==4||state.face1ElapsedSeconds!==4||state.materialBindingCount!==5)throw new Error("review must preserve both face histories and bind all five food components");
  if(state.hasNewRaster||state.hasNewTexture||state.hasNewGLB||state.triangleCount!==476)throw new Error("derived state must reuse raw model and texture inputs only");
  const screenshot=path.join(root,"review-mdl-negima-grill-cooking-second-face-fhd-r1.png");
  await page.screenshot({path:screenshot,clip:{x:0,y:0,width:1920,height:1080}});
  const bytes=await readFile(screenshot);
  const report={schemaVersion:1,id:"MDL-NEGIMA-GRILL-COOKING-SECOND-FACE",reviewHarness:"actual Three.js raw composition at the first flip endpoint plus face-specific fragment cooking mask",state,screenshot:{file:"../review-mdl-negima-grill-cooking-second-face-fhd-r1.png",sha256:crypto.createHash("sha256").update(bytes).digest("hex"),bytes:bytes.length,width:1920,height:1080},result:"passed"};
  await writeFile(path.join(here,"cooking-state-review-report.json"),`${JSON.stringify(report,null,2)}\n`);
  console.log(JSON.stringify(report));
}finally{await browser.close();}
