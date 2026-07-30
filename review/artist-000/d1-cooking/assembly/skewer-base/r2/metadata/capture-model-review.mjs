import path from "node:path";
import { writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../../../../");
const playwrightModule = await import(pathToFileURL(path.join(root, "app/node_modules/@playwright/test/index.js")).href);
const { chromium } = playwrightModule.default;
const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on("console", (message) => console.log(`browser:${message.type()}:${message.text()}`));
  page.on("pageerror", (error) => console.error(`browser-pageerror:${error.message}`));
  await page.goto("http://127.0.0.1:8011/art-workspace/review/artist-000/d1-cooking/assembly/skewer-base/r2/review/review-skewer-base-r2.html");
  await page.waitForFunction(() => document.body.dataset.ready === "true");
  const dataUrl = await page.evaluate(() => document.querySelector("#review").toDataURL("image/png"));
  await writeFile(path.join(root, "art-workspace/review/artist-000/d1-cooking/assembly/skewer-base/r2/review/review-mdl-skewer-base-r2.png"), Buffer.from(dataUrl.split(",")[1], "base64"));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally { await browser.close(); }
