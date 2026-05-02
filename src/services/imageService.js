const sharp = require("sharp");

async function maybeResizeImage(buffer, shouldResize, resizeWidth) {
  if (!shouldResize) {
    return buffer;
  }

  return sharp(buffer)
    .rotate()
    .resize({
      width: resizeWidth,
      fit: "inside",
      withoutEnlargement: true
    })
    .toBuffer();
}

module.exports = {
  maybeResizeImage
};
