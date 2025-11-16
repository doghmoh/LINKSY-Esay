const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/banners exists
const uploadPath = path.join(__dirname, "..", "uploads", "banners");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

module.exports = upload;
