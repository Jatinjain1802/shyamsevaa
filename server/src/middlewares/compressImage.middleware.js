import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

sharp.cache(false);

const compressImagesMiddleware = async (req, res, next) => {
  try {
    // Handle both req.file (single) and req.files (object with arrays from upload.fields)
    let files = [];

    if (req.file) {
      // Single file upload
      files = [req.file];
    } else if (req.files) {
      // Multiple files from upload.fields() - flatten the nested arrays
      if (Array.isArray(req.files)) {
        files = req.files;
      } else {
        // req.files is an object like { fieldname: [file1, file2, ...] }
        files = Object.values(req.files).flat();
      }
    }

    if (!files || files.length === 0) return next();

    const compressPromises = files.map(async (file) => {
      // For memory storage, file.path is not available. 
      // But typically we use disk storage with multer.
      if (!file.path) return;

      const ext = path.extname(file.originalname).toLowerCase();

      // Skip PDFs or non-image files
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
      if (!allowedExts.includes(ext)) return;

      const inputPath = file.path;
      const tmpPath = inputPath + '_tmp';

      try {
        // Compress and resize with "contain" to prevent cropping
        await sharp(inputPath)
          .resize({ 
            width: 1024, 
            height: 1024, 
            fit: 'contain', 
            background: { r: 255, g: 255, b: 255, alpha: 1 } 
          })
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(tmpPath);

        // Delete original file then rename temp file to original
        if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }
        fs.renameSync(tmpPath, inputPath);
      } catch (e) {
        console.error(`Error compressing file ${file.originalname}:`, e);
        // clean up temp file if compression fails
        if (fs.existsSync(tmpPath)) {
          fs.unlinkSync(tmpPath);
        }
      }
    });

    await Promise.all(compressPromises);

    next();
  } catch (err) {
    console.error("Compression middleware error:", err);
    next(err);
  }
};

export default compressImagesMiddleware;
