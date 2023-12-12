const multer = require("multer");
const AppError = require("./appError");

const memoryStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

exports.uploadToMemory = (maxSize) =>
  multer({
    storage: memoryStorage,
    fileFilter: multerFilter,
    limits: { fileSize: maxSize },
  });
