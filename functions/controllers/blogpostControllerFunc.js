// const sharp = require("sharp");
const cloudinaryUploadStream = require("../utils/cloudinaryUploadStream");

exports.uploadImgToCloudinary = async (sharpBuffer, identifier) => {
  const { flag, modelId } = identifier;
  const currentDate = new Date().toISOString().split("T")[0];
  const dateMilliseconds = new Date().getMilliseconds();

  return await cloudinaryUploadStream(
    sharpBuffer,
    `${flag}-${modelId}_${currentDate}-${dateMilliseconds}`,
    `my-mini-blog/${flag}_img`,
  );
};

exports.getImgUrl = (cloudinaryUploadResponse) => {
  const urlArr = cloudinaryUploadResponse.url.split("/");
  return `/${urlArr.slice(urlArr.length - 4).join("/")}`;
};
