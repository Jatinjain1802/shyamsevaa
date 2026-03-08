import multer from "multer";
import path from "path";
import fs from "fs";

// ===============================
// Fieldname → folder mapping
// ===============================
const folderMap = {
  pooja_image: "poojas",
  chadawa_image: "chadawas",
  temple_image: "temples",
  blog_image: "blogs",
  addon_image: "addons",
  addon_image: "addons",
  pooja_gallery: "poojas",
  temple_gallery: "temples",
  chadawa_gallery: "chadawas",
  product_image: "products",
  image: "products",
};

// ===============================
// Storage config
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subFolder = folderMap[file.fieldname] || "others";
    const folderPath = path.join("uploads", subFolder);

    // ensure folder exists
    fs.mkdirSync(folderPath, { recursive: true });

    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// ===============================
// File filter
// ===============================
const allowedTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const fileFilter = (req, file, cb) => {
  if (allowedTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPEG, JPG, PNG, WEBP, PDF files are allowed"),
      false
    );
  }
};

// ===============================
// Multer instance
// ===============================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
