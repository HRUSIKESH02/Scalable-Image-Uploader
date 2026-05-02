const multer = require("multer");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.maxFileSizeBytes
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new AppError("Only JPG and PNG images are allowed.", 400));
    }
    cb(null, true);
  }
});

module.exports = upload;
