import * as TempleModel from "../models/temples.model.js";

export const createTemple = async (req, res) => {
  try {
    const { title, image, description, city, state } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Temple title is required",
      });
    }

    // Handle file upload - if file is uploaded, use file path; otherwise use URL from body
    let imagePath = image;
    if (req.file) {
      imagePath = `/uploads/temples/${req.file.filename}`;
    }

    const id = await TempleModel.createTemple({
      title,
      image: imagePath,
      description,
      city,
      state,
    });

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

    return res.json({ success: true, data: temple });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateTemple = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle file upload - if file is uploaded, use file path
    if (req.file) {
      updateData.image = `/uploads/temples/${req.file.filename}`;
    }

    const updated = await TempleModel.updateTemple(
      req.params.id,
      updateData
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    return res.json({
      success: true,
      message: "Temple updated successfully",
    });
  } catch (error) {
    console.error("Update temple error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
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
