const multer = require('multer');
const Customerror = require('../util/error');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    const type = file.mimetype.includes('svg')
      ? 'svg'
      : file.mimetype.split('/')[1];
    const uniqueSuffix = Date.now() + '-' + new Date().getTime();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + type);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(
        new Customerror('Only .png, .jpg and .jpeg format allowed!', 400),
        false
      );
    }
  },
});

module.exports = { upload };
