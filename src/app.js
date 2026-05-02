const express = require("express");
const uploadRoutes = require("./routes/uploadRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.use("/", uploadRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
