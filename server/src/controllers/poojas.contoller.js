import * as PoojaModel from "../models/poojas.model.js";

export const createPooja = async (req, res) => {
  try {
    const { temple_id, title, image, description, benefits } = req.body;

    if (!temple_id || !title) {
      return res.status(400).json({
        success: false,
        message: "Temple and title are required",
      });
    }

    const id = await PoojaModel.createPooja({
      temple_id,
      title,
      image,
      description,
      benefits,
    });

    return res.status(201).json({
      success: true,
      message: "Pooja created successfully",
      id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPoojasByTemple = async (req, res) => {
  const data = await PoojaModel.getPoojasByTemple(req.params.templeId);
  res.json({ success: true, data });
};

export const getPoojaDetail = async (req, res) => {
  const pooja = await PoojaModel.getPoojaDetail(req.params.id);
  if (!pooja) {
    return res.status(404).json({ success: false, message: "Pooja not found" });
  }
  res.json({ success: true, data: pooja });
};

export const deletePooja = async (req, res) => {
  const deleted = await PoojaModel.deletePooja(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Pooja not found" });
  }
  res.json({ success: true, message: "Pooja deleted" });
};
