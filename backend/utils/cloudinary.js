const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "it-recruitment-cvs",
    allowed_formats: ["pdf", "doc", "docx"], // Chỉ cho phép định dạng văn bản
    resource_type: "auto", // Quan trọng: PDF/Word cần resource_type là raw hoặc auto
    public_id: (req, file) => `cv_${Date.now()}_${file.originalname.split('.')[0]}`,
  },
});

const uploadCloud = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = uploadCloud;
