import http from "http";

async function main() {
  // 1x1 transparent PNG base64
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";
  const json = JSON.stringify({ image: `data:image/png;base64,${base64}` });

  const options = {
    hostname: "localhost",
    port: 8080,
    path: "/api/detect",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(json),
    },
  };

  const req = http.request(options, (res) => {
    let body = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      console.log("STATUS:", res.statusCode);
      console.log("HEADERS:", JSON.stringify(res.headers, null, 2));
      console.log("BODY:", body);
    });
  });

  req.on("error", (e) => {
    console.error("Request error:", e);
  });

  req.write(json);
  req.end();
}

main();
