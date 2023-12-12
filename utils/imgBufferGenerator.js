const sharp = require("sharp");

function parseImgSize({ width, height, orientation }) {
  return (orientation || 0) >= 5
    ? { width: height, height: width }
    : { width, height };
}

class ImgBufferGenerator {
  constructor(bufferSource) {
    this.bufferSource = bufferSource;
  }

  async getSourceImgSize() {
    return parseImgSize(await sharp(this.bufferSource).metadata());
  }

  async getSharpBuffer(outputSize, fitSetting) {
    const { width, height } = outputSize;

    return await sharp(this.bufferSource)
      .resize(width, height, { fit: fitSetting })
      .toFormat("jpeg")
      .jpeg({ quality: 90, mozjpeg: true })
      .keepExif()
      .toBuffer();
  }

  async generateImgBufferPrioritizeWidth(outputSize) {
    const imgSize = await this.getSourceImgSize();
    const aspectRatio = outputSize.width / outputSize.height;

    if (imgSize.width / imgSize.height <= aspectRatio) {
      return await this.getSharpBuffer(outputSize, "cover");
    }
    return await this.getSharpBuffer(outputSize, "inside");
  }

  async generateImgBufferPrioritizeHeight(outputSize) {
    const imgSize = await this.getSourceImgSize();
    const aspectRatio = outputSize.width / outputSize.height;

    if (imgSize.width / imgSize.height >= aspectRatio) {
      return await this.getSharpBuffer(outputSize, "cover");
    }
    return await this.getSharpBuffer(outputSize, "inside");
  }
}

module.exports = ImgBufferGenerator;
