const http = require("http");
const { spawn } = require("child_process");

const PORT = process.env.PORT || "3001";
const serverProcess = spawn(process.execPath, ["src/server.js"], {
  env: { ...process.env, PORT },
  stdio: "inherit"
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${PORT}/health`, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(body);
        } else {
          reject(new Error(`Unexpected status code: ${res.statusCode}`));
        }
      });
    });
    req.on("error", reject);
  });
}

async function main() {
  try {
    await wait(2000);
    await requestHealth();
    serverProcess.kill("SIGTERM");
    process.exit(0);
  } catch (error) {
    console.error(error);
    serverProcess.kill("SIGTERM");
    process.exit(1);
  }
}

serverProcess.on("exit", (code) => {
  if (code !== 0) {
    process.exit(code || 1);
  }
});

main();
