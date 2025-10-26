import https from 'https';
import http from 'http';
import fs from 'fs';

const models = [
  'prof-freakenstein/plantnet-disease-detection',
  'gopalkumr/Plant-disease-detection',
  'nateraw/plant-disease-classification',
  'YuchengShi/LLaVA-v1.5-7B-Plant-Leaf-Diseases-Detection',
  'microsoft/resnet-50',
  'google/vit-base-patch16-224'
];

const imageUrl = 'https://cdn.builder.io/api/v1/image/assets%2F9a08e76889074a27806519bd7e3ac637%2F4dcfa529482f4beca23a7e1afe3a46ea?format=webp&width=800';

function fetchBuffer(url){
  return new Promise((resolve, reject) => {
    const get = url.startsWith('https') ? https.get : http.get;
    get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400) return reject(new Error('Failed to fetch image, status ' + res.statusCode));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function callHF(model, buffer, hfKey){
  return new Promise((resolve) => {
    const options = {
      hostname: 'api-inference.huggingface.co',
      path: `/models/${model}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hfKey}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': buffer.length
      }
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', (e) => resolve({ status: 0, error: String(e) }));
    req.write(buffer);
    req.end();
  });
}

async function main(){
  try{
    console.log('Fetching image...');
    const buf = await fetchBuffer(imageUrl);
    console.log('Image size:', buf.length);
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey) { console.error('No HUGGINGFACE_API_KEY in env'); process.exit(2); }

    for (const m of models) {
      console.log('Testing model:', m);
      const r = await callHF(m, buf, hfKey);
      console.log(' -> status', r.status, 'body preview:', (r.body || r.error || '').slice(0, 200));
    }
  } catch (e) { console.error(e); process.exit(1); }
}

main();
