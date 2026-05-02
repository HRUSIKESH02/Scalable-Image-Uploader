const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3001,
  awsRegion: process.env.AWS_REGION || "us-east-1",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3BucketName: process.env.S3_BUCKET_NAME,
  maxFileSizeBytes: 2 * 1024 * 1024,
  enableImageResize: String(process.env.ENABLE_IMAGE_RESIZE || "true").toLowerCase() === "true",
  resizeWidth: Number(process.env.RESIZE_WIDTH) || 1200
};

module.exports = env;
