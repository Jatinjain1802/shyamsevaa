import * as ProductModel from "../models/products.model.js";
import { translateObject } from "../utils/translation.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, image_url, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = `/uploads/products/${req.file.filename}`;
    }

    // Auto-translation
    const translated = await translateObject({ name, description, category });

    const productId = await ProductModel.createProduct({
      name,
      name_hi: translated.name_hi,
      description,
      description_hi: translated.description_hi,
      category,
      category_hi: translated.category_hi,
      price,
      stock_quantity,
      image_url: finalImageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId,
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image_url = `/uploads/products/${req.file.filename}`;
    }

    // Auto-translation for fields that are being updated
    const translationInputs = {};
    if (updateData.name) translationInputs.name = updateData.name;
    if (updateData.description) translationInputs.description = updateData.description;
    if (updateData.category) translationInputs.category = updateData.category;

    if (Object.keys(translationInputs).length > 0) {
      const translated = await translateObject(translationInputs);
      if (translated.name_hi) updateData.name_hi = translated.name_hi;
      if (translated.description_hi) updateData.description_hi = translated.description_hi;
      if (translated.category_hi) updateData.category_hi = translated.category_hi;
    }

    const updated = await ProductModel.updateProduct(productId, updateData);

    if (!updated && updated !== 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleted = await ProductModel.deleteProduct(productId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status,
    };
    const products = await ProductModel.getAllProducts(filters);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Error in getProductDetail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
