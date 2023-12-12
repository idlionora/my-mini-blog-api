const { Readable } = require("stream");
const cloudinary = require("cloudinary").v2;

const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

const cloudinaryUploadStream = (fileStream, fileName, Destinationfolder) =>
  new Promise((resolve, reject) => {
    const cloudinaryUpload = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        folder: Destinationfolder,
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    bufferToStream(fileStream).pipe(cloudinaryUpload);
  });

module.exports = cloudinaryUploadStream;
