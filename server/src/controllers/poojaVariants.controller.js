import * as PoojaModel from "../models/poojaVariants.model.js";
/* =======================
   POOJA VARIANTS (ADMIN)
======================= */

export const addPoojaVariant = async (req, res) => {
  try {
    const { persons, description, price } = req.body;
    const { poojaId } = req.params;

    if (!persons || !price) {
      return res.status(400).json({
        success: false,
        message: "Persons and price are required",
      });
    }

    const variantId = await PoojaModel.addPoojaVariant({
      poojaId,
      persons,
      description,
      price,
    });

    return res.status(201).json({
      success: true,
      message: "Pooja variant added",
      variantId,
    });
  } catch (err) {
    // duplicate (pooja_id, persons)
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Variant for this number of persons already exists",
      });
    }

    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePoojaVariant = async (req, res) => {
  try {
    const { persons, description, price } = req.body;
    const { variantId } = req.params;

    const updated = await PoojaModel.updatePoojaVariant(variantId, {
      persons,
      description,
      price,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    res.json({
      success: true,
      message: "Pooja variant updated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deletePoojaVariant = async (req, res) => {
  try {
    const deleted = await PoojaModel.deletePoojaVariant(
      req.params.variantId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    res.json({
      success: true,
      message: "Pooja variant deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPoojaVariants = async (req, res) => {
  const variants = await PoojaModel.getVariantsByPoojaId(
    req.params.poojaId
  );

  res.json({
    success: true,
    data: variants,
  });
};
