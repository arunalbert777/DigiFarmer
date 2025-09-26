import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

async function render() {
  const filePath = path.resolve('./public/diagrams/disease_flowchart.html');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(2);
  }
  const url = 'file://' + filePath;
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    // Wait a bit for rendering
    await page.waitForTimeout(300);
    const outPath = path.resolve('./public/diagrams/disease_flowchart.png');
    const element = await page.$('svg') || await page.$('body');
    if (!element) {
      console.error('No SVG or body element found to screenshot');
      process.exit(3);
    }
    const clip = await element.boundingBox();
    if (clip) {
      await element.screenshot({ path: outPath });
    } else {
      await page.screenshot({ path: outPath, fullPage: true });
    }
    console.log('Saved PNG to', outPath);
  } finally {
    await browser.close();
  }
}

render().catch((e) => { console.error(e); process.exit(1); });
