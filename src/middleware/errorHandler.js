const multer = require("multer");

function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found."
  });
}

function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size exceeds 2MB limit."
      });
    }
    return res.status(400).json({
      error: err.message
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      error: err.message
    });
  }

  console.error(err);
  return res.status(500).json({
    error: "Internal server error."
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
