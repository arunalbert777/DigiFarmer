import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

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

async function main(){
  try{
    console.log('Fetching image...');
    const buf = await fetchBuffer(imageUrl);
    console.log('Fetched', buf.length, 'bytes');
    const base64 = buf.toString('base64');
    const payload = JSON.stringify({ image: `data:image/webp;base64,${base64}` });

    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/detect',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 30000
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', body);
      });
    });

    req.on('error', (e) => console.error('request error', e));
    req.write(payload);
    req.end();
  }catch(e){
    console.error('Error:', e);
    process.exit(1);
  }
}

main();
