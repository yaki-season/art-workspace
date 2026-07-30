import { writeFile } from "node:fs/promises";
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
  await page.goto("http://127.0.0.1:8011/art-workspace/review/artist-000/d1-cooking/grill/raw-negima/r1/review-mdl-negima-grill-raw-flip-fhd-r1.html");
  await page.waitForFunction(()=>document.body.dataset.ready==="true");
  const initial=await page.evaluate(()=>window.__negimaFlipReview.state());
  await page.mouse.click(960,540);await page.waitForFunction(()=>document.body.dataset.turn==="1");
  const afterFirst=await page.evaluate(()=>window.__negimaFlipReview.state());
  await page.mouse.click(960,540);await page.waitForFunction(()=>document.body.dataset.turn==="2");
  const afterSecond=await page.evaluate(()=>window.__negimaFlipReview.state());
  const epsilon=1e-6;
  if(Math.abs(initial.rotationY)>epsilon||initial.face!==0)throw new Error("initial raw face must be 0 radians");
  if(Math.abs(afterFirst.rotationY-Math.PI)>epsilon||afterFirst.face!==1)throw new Error("first click must end at PI / face 1");
  if(Math.abs(afterSecond.rotationY-Math.PI*2)>epsilon||afterSecond.face!==0)throw new Error("second click must end at 2PI / face 0");
  await page.evaluate(()=>{location.reload();});await page.waitForFunction(()=>document.body.dataset.ready==="true");
  const screenshot=path.join(root,"review-mdl-negima-grill-raw-flip-fhd-r1.png");
  await page.screenshot({path:screenshot,clip:{x:0,y:0,width:1920,height:1080}});
  const bytes=await (await import("node:fs/promises")).readFile(screenshot);
  const report={schemaVersion:1,id:"MDL-NEGIMA-GRILL-RAW",reviewHarness:"Three.js actual GLB composition; one click per test",initial,afterFirst,afterSecond,screenshot:{file:"../review-mdl-negima-grill-raw-flip-fhd-r1.png",sha256:crypto.createHash("sha256").update(bytes).digest("hex"),bytes:bytes.length},result:"passed"};
  await writeFile(path.join(here,"flip-review-report.json"),`${JSON.stringify(report,null,2)}\n`);
  console.log(JSON.stringify(report));
}finally{await browser.close();}
