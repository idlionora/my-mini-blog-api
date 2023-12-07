const sharp = require("sharp");
const cloudinaryUploadStream = require("../utils/cloudinaryUploadStream");

exports.getImageSize = ({ width, height, orientation }) =>
  (orientation || 0) >= 5
    ? { width: height, height: width }
    : { width, height };

async function sharpProcess(bufferSource, outputSize, fitSetting) {
  const { width, height } = outputSize;

  return await sharp(bufferSource)
    .resize(width, height, { fit: fitSetting })
    .toFormat("jpeg")
    .jpeg({ quality: 90, mozjpeg: true })
    .keepExif()
    .toBuffer();
}

exports.generateSharpBuffer = async (bufferSource, imgSize, outputSize) => {
  const aspectRatio = outputSize.width / outputSize.height;

  if (imgSize.width / imgSize.height <= aspectRatio) {
    return await sharpProcess(bufferSource, outputSize, "cover");
  }

  if (imgSize.width / imgSize.height > aspectRatio) {
    return await sharpProcess(bufferSource, outputSize, "inside");
  }
};

exports.uploadImgToCloudinary = async (sharpBuffer, flag, blogpostId) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const dateMilliseconds = new Date().getMilliseconds();

  return await cloudinaryUploadStream(
    sharpBuffer,
    `${flag}-${blogpostId}_${currentDate}-${dateMilliseconds}`,
    `my-mini-blog/${flag}_img`,
  );
};

exports.getImgUrl = (cloudinaryUploadResponse) => {
  const urlArr = cloudinaryUploadResponse.url.split("/");
  return `/${urlArr.slice(urlArr.length - 4).join("/")}`;
};
