import path from 'path';
import express from 'express';
import multer from 'multer';
import pkg from 'cloudinary';

const uploadRouter = express.Router();
const cloudinary = pkg;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

uploadRouter.post('/', upload.single('image'), async (req, res) => {
  const uploadPhoto = await cloudinary.uploader.upload(`${req.file.path}`);
  res.send(uploadPhoto.url);
});

export default uploadRouter;
