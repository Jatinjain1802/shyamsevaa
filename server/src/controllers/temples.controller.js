import * as TempleModel from "../models/temples.model.js";
import { translateObject } from "../utils/translation.js";

export const createTemple = async (req, res) => {
  try {
    const { title, image, description, city, state } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Temple title is required",
      });
    }

    // Handle auto-translation
    const translatableFields = { title, description, city, state };
    const translated = await translateObject(translatableFields);

    // Handle file upload
    let imagePath = image;
    if (req.files && req.files['temple_image']) {
      imagePath = `/uploads/temples/${req.files['temple_image'][0].filename}`;
    } else if (req.file) {
      imagePath = `/uploads/temples/${req.file.filename}`;
    }

    const id = await TempleModel.createTemple({
      title,
      title_hi: translated.title_hi,
      image: imagePath,
      description,
      description_hi: translated.description_hi,
      city,
      city_hi: translated.city_hi,
      state,
      state_hi: translated.state_hi,
    });

    // Handle Gallery Images
    if (req.files && req.files['temple_gallery']) {
      const galleryFiles = req.files['temple_gallery'];
      let galleryDescriptions = req.body.gallery_description || [];

      if (!Array.isArray(galleryDescriptions)) {
        galleryDescriptions = [galleryDescriptions];
      }

      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const description = galleryDescriptions[i] || "";
        const galleryPath = `/uploads/temples/${file.filename}`;
        await TempleModel.addTempleImage(id, galleryPath, description);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Temple created successfully",
      id,
    });
  } catch (error) {
    console.error("Create temple error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllTemples = async (req, res) => {
  try {
    const temples = await TempleModel.getAllTemples();
    return res.json({ success: true, data: temples });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTempleById = async (req, res) => {
  try {
    const temple = await TempleModel.getTempleById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    // Fetch gallery images
    const gallery = await TempleModel.getTempleImages(req.params.id);
    temple.gallery = gallery;

    return res.json({ success: true, data: temple });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateTemple = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle auto-translation if fields are updated
    if (updateData.title || updateData.description || updateData.city || updateData.state) {
      const translatableFields = {};
      if (updateData.title) translatableFields.title = updateData.title;
      if (updateData.description) translatableFields.description = updateData.description;
      if (updateData.city) translatableFields.city = updateData.city;
      if (updateData.state) translatableFields.state = updateData.state;

      const translated = await translateObject(translatableFields);
      Object.assign(updateData, translated);
    }

    // Handle file upload
    if (req.files && req.files['temple_image']) {
      updateData.image = `/uploads/temples/${req.files['temple_image'][0].filename}`;
    } else if (req.file) {
      updateData.image = `/uploads/temples/${req.file.filename}`;
    }

    const updated = await TempleModel.updateTemple(
      req.params.id,
      updateData
    );

    // Append Gallery Images
    if (req.files && req.files['temple_gallery']) {
      const galleryFiles = req.files['temple_gallery'];
      let galleryDescriptions = req.body.gallery_description || [];

      if (!Array.isArray(galleryDescriptions)) {
        galleryDescriptions = [galleryDescriptions];
      }

      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const description = galleryDescriptions[i] || "";
        const galleryPath = `/uploads/temples/${file.filename}`;
        await TempleModel.addTempleImage(req.params.id, galleryPath, description);
      }
    }

    // if (!updated) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Temple not found",
    //   });
    // }

    return res.json({
      success: true,
      message: "Temple updated successfully",
    });
  } catch (error) {
    console.error("Update temple error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteTempleGalleryImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const deleted = await TempleModel.deleteTempleImage(imageId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteTemple = async (req, res) => {
  try {
    const deleted = await TempleModel.deleteTemple(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    return res.json({
      success: true,
      message: "Temple deleted successfully",
    });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
