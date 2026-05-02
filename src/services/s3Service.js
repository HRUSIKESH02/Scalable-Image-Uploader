const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const env = require("../config/env");

const s3Client = new S3Client({
  region: env.awsRegion,
  credentials: env.awsAccessKeyId && env.awsSecretAccessKey
    ? {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey
      }
    : undefined
});

function buildS3PublicUrl(bucketName, key) {
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

function buildUniqueObjectKey(originalName, mimeType) {
  const extension = mimeType === "image/png" ? "png" : "jpg";
  const baseName = String(originalName || "image").replace(/\.[^.]+$/, "");
  const sanitizedOriginalName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "image";

  return `${Date.now()}-${uuidv4()}-${sanitizedOriginalName}.${extension}`;
}

async function uploadBufferToS3({ buffer, mimeType, originalName }) {
  const key = buildUniqueObjectKey(originalName, mimeType);

  const command = new PutObjectCommand({
    Bucket: env.s3BucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType
  });

  await s3Client.send(command);

  return {
    key,
    url: buildS3PublicUrl(env.s3BucketName, key)
  };
}

module.exports = {
  uploadBufferToS3
};
