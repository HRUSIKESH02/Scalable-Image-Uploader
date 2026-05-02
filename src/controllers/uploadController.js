const env = require("../config/env");
const AppError = require("../utils/AppError");
const { maybeResizeImage } = require("../services/imageService");
const { uploadBufferToS3 } = require("../services/s3Service");

async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError("No image file provided. Use form field name 'image'.", 400);
    }

    if (!env.s3BucketName) {
      throw new AppError("S3_BUCKET_NAME is not configured.", 500);
    }

    const processedBuffer = await maybeResizeImage(
      req.file.buffer,
      env.enableImageResize,
      env.resizeWidth
    );

    const result = await uploadBufferToS3({
      buffer: processedBuffer,
      mimeType: req.file.mimetype,
      originalName: req.file.originalname
    });

    return res.status(201).json({
      url: result.url
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  uploadImage
};
