import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const workspace = path.resolve(import.meta.dirname, '../../../../../../../..');
const requireFromApp = createRequire(path.join(workspace, 'app/package.json'));
const { chromium } = requireFromApp('playwright');
const outputDirectory = path.resolve(import.meta.dirname, '.');
const closedPath = path.join(
  workspace,
  'art-workspace/review/artist-023/s0-prologue/exterior-key/bg-exterior-s0-closed/closed/r2/assets/bg-exterior-s0-closed-r2-pixel-fhd.png',
);
const keyPath = path.join(
  workspace,
  'art-workspace/review/artist-023/s0-prologue/exterior-key/pr-shop-key/placed/r1/assets/pr-shop-key-placed-r1.png',
);

const toDataUrl = async (file) => (
  `data:image/png;base64,${(await readFile(file)).toString('base64')}`
);
const closedUrl = await toDataUrl(closedPath);
const keyUrl = await toDataUrl(keyPath);
const browser = await chromium.launch({ headless: true });

try {
  for (const [name, width, height] of [
    ['fhd', 1920, 1080],
    ['hd', 1280, 720],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.addInitScript((background) => {
      window.__S0_EXTERIOR_APPROVED_ASSETS__ = {
        'BG-EXTERIOR-S0-CLOSED': background,
      };
    }, closedUrl);
    await page.goto(
      'http://localhost:8777/src/s0-exterior-background-harness.html?stateId=S0-STATE-KEY&mode=approved',
      { waitUntil: 'networkidle' },
    );
    await page.waitForFunction(() => window.__s0ExteriorBackgroundHarness?.renderedMode === 'approved');
    await page.evaluate((url) => {
      const key = document.createElement('img');
      key.id = 'key-runtime-visual';
      key.alt = '';
      key.setAttribute('aria-hidden', 'true');
      key.dataset.runtimeVisualAssetId = 'PR-SHOP-KEY';
      key.src = url;
      Object.assign(key.style, {
        position: 'absolute', left: '256px', top: '650px', width: '224px', height: '150px',
        objectFit: 'contain', imageRendering: 'pixelated', zIndex: '40', pointerEvents: 'none',
      });
      document.querySelector('#art-camera').append(key);
    }, keyUrl);
    await page.waitForFunction(() => document.querySelector('#key-runtime-visual')?.complete === true);
    const snapshot = await page.evaluate(() => {
      const key = document.querySelector('#key-runtime-visual');
      const domSafe = document.querySelector('#dom-safe');
      const rect = (element) => element.getBoundingClientRect().toJSON();
      return {
        backgroundMode: window.__s0ExteriorBackgroundHarness.renderedMode,
        requiredBackgroundAssetId: document.body.dataset.requiredAssetId,
        cameraId: document.body.dataset.cameraId,
        semanticOwner: document.body.dataset.semanticOwner,
        stateId: document.body.dataset.stateId,
        bodyPartCount: document.body.dataset.bodyPartCount,
        keyVisualAssetId: key.dataset.runtimeVisualAssetId,
        keyLogicalBounds: { x: 256, y: 650, width: 224, height: 150 },
        keyRect: rect(key),
        domSafeRect: rect(domSafe),
        domActionIsNative: document.querySelector('#state-action') instanceof HTMLButtonElement,
        keyOverlapsDomSafe: !(key.getBoundingClientRect().bottom <= domSafe.getBoundingClientRect().top),
      };
    });
    const expectedScale = name === 'fhd' ? 1 : 2 / 3;
    if (
      snapshot.backgroundMode !== 'approved'
      || snapshot.requiredBackgroundAssetId !== 'BG-EXTERIOR-S0-CLOSED'
      || snapshot.cameraId !== 'S0-EXTERIOR-FIXED-V1'
      || snapshot.semanticOwner !== 'artist-2.s0-prologue-story'
      || snapshot.stateId !== 'S0-STATE-KEY'
      || snapshot.bodyPartCount !== '0'
      || snapshot.keyVisualAssetId !== 'PR-SHOP-KEY'
      || snapshot.keyOverlapsDomSafe
      || !snapshot.domActionIsNative
      || Math.abs(snapshot.keyRect.width - 224 * expectedScale) > 0.1
      || Math.abs(snapshot.keyRect.height - 150 * expectedScale) > 0.1
    ) {
      throw new Error(`KEY consumption contract mismatch for ${name}: ${JSON.stringify(snapshot)}`);
    }
    await page.locator('#logical-stage').screenshot({
      path: path.join(outputDirectory, `key-consumption-closed-${name}-r1.png`),
    });
    await page.close();
  }
} finally {
  await browser.close();
}
