const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cbf) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid mime type");
    if (isValid) {
      err = null;
    }
    cbf(err, "Backend/images");
  },
  filename: (req, file, cbf) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cbf(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage }).single("image");
