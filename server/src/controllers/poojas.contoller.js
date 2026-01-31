import * as PoojaModel from "../models/poojas.model.js";

/* ================= ADMIN ================= */

export const createPooja = async (req, res) => {
  try {
    const { title, image, description, benefits } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description required",
      });
    }

    let imagePath = image;
    if (req.file) {
      imagePath = `/uploads/poojas/${req.file.filename}`;
    }

    const poojaId = await PoojaModel.createPooja({
      title,
      image: imagePath,
      description,
      benefits,
    });

    return res.status(201).json({
      success: true,
      message: "Pooja created",
      poojaId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePooja = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/poojas/${req.file.filename}`;
    }

    const updated = await PoojaModel.updatePooja(
      req.params.poojaId,
      updateData
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Pooja not found",
      });
    }

    res.json({ success: true, message: "Pooja updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deletePooja = async (req, res) => {
  try {
    const deleted = await PoojaModel.deletePooja(req.params.poojaId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Pooja not found",
      });
    }

    res.json({ success: true, message: "Pooja deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ================= USER ================= */

export const getPoojasByTemple = async (req, res) => {
  const data = await PoojaModel.getPoojasByTemple(req.params.templeId);
  res.json({ success: true, data });
};

export const getAllPoojas = async (req, res) => {
  try {
    const data = await PoojaModel.getAllPoojas();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPoojaDetail = async (req, res) => {
  const poojaId = req.params.poojaId;

  const pooja = await PoojaModel.getPoojaById(poojaId);
  if (!pooja) {
    return res.status(404).json({
      success: false,
      message: "Pooja not found",
    });
  }

  const [variants, addons, temples, reviews] = await Promise.all([
    PoojaModel.getVariantsByPooja(poojaId),
    PoojaModel.getAddonsByPooja(poojaId),
    PoojaModel.getTemplesByPooja(poojaId),
    PoojaModel.getReviewsByPooja(poojaId),
  ]);

  res.json({
    success: true,
    data: {
      pooja,
      variants,
      addons,
      temples,
      reviews,
    },
  });
};