const cloundinary = require('cloudinary').v2;
const fs = require('fs');

const cloundinaryUploadPromise = (path) =>
  new Promise((resolve, rejects) => {
    cloundinary.uploader.upload(path, (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
        fs.unlinkSync(path);
      }
    });
  });

module.exports = cloundinaryUploadPromise;
