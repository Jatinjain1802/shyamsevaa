import * as TempleModel from "../models/temples.model.js";

export const createTemple = async (req, res) => {
  try {
    const { title, image, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Temple title is required",
      });
    }

    const id = await TempleModel.createTemple({
      title,
      image,
      description,
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
    const updated = await TempleModel.updateTemple(
      req.params.id,
      req.body
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
  } catch {
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
