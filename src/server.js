const app = require("./app");
const env = require("./config/env");

const server = app.listen(env.port, () => {
  console.log(`Image upload server running on port ${env.port}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
