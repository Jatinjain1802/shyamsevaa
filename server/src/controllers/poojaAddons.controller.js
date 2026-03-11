
import * as PoojaModel from "../models/poojaAddons.model.js";
import { translateObject } from "../utils/translation.js";

/* =======================
   ADDONS (ADMIN)
======================= */

export const createAddon = async (req, res) => {
    try {
        let { title, description, price, is_common } = req.body;

        if (!title || !price) {
            return res.status(400).json({
                success: false,
                message: "Title and price are required",
            });
        }

        // Auto-translate to Hindi
        const translations = await translateObject({ title, description }, ["title", "description"]);

        let imagePath = req.body.image; // fallback to URL if provided in body
        if (req.file) {
            imagePath = `/uploads/addons/${req.file.filename}`;
        }

        // Normalize is_common: handle boolean, number, or string correctly
        const normalizedIsCommon = (is_common === true || is_common === 1 || is_common === "1" || is_common === "true") ? 1 : 0;

        const addonId = await PoojaModel.createAddon({
            title,
            ...translations,
            image: imagePath,
            description,
            price,
            is_common: normalizedIsCommon,
        });

        res.status(201).json({
            success: true,
            message: "Addon created",
            addonId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateAddon = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Handle auto-translation if fields are updated
        if (updateData.title || updateData.description) {
            const translatable = {};
            if (updateData.title) translatable.title = updateData.title;
            if (updateData.description) translatable.description = updateData.description;
            
        // Handle is_common normalization if it exists in update data
        if (updateData.is_common !== undefined) {
             updateData.is_common = (updateData.is_common === true || updateData.is_common === 1 || updateData.is_common === "1" || updateData.is_common === "true") ? 1 : 0;
        }

        const translations = await translateObject(translatable, Object.keys(translatable));
            Object.assign(updateData, translations);
        }

        if (req.file) {
            updateData.image = `/uploads/addons/${req.file.filename}`;
        }

        const updated = await PoojaModel.updateAddon(
            req.params.addonId,
            updateData
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Addon not found",
            });
        }

        res.json({ success: true, message: "Addon updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteAddon = async (req, res) => {
    const deleted = await PoojaModel.deleteAddon(req.params.addonId);

    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: "Addon not found",
        });
    }

    res.json({ success: true, message: "Addon deleted" });
};

/* =======================
   POOJA ↔ ADDON MAPPING
======================= */

export const mapAddonToPooja = async (req, res) => {
    const { addon_id, is_common } = req.body;
    const { poojaId } = req.params;

    // 1. Link to this specific pooja
    const mapId = await PoojaModel.mapAddonToPooja(
        poojaId,
        addon_id
    );

    // 2. ONLY if 'is_common' is TRUE, update the master addon record to make it common
    // If it's false or undefined, we leave the master record as it is.
    if (is_common === true) {
        await PoojaModel.updateAddon(addon_id, { is_common: true });
    }

    res.json({
        success: true,
        message: "Addon linked to pooja",
        mapId,
    });
};

export const removeAddonFromPooja = async (req, res) => {
    await PoojaModel.removeAddonFromPooja(req.params.mapId);
    res.json({
        success: true,
        message: "Addon removed from pooja",
    });
};

/* =======================
   GET ADDONS (ADMIN)
======================= */

export const getAllAddons = async (req, res) => {
    const data = await PoojaModel.getAllAddons();
    res.json({
        success: true,
        data,
    });
};

export const getPoojaAddons = async (req, res) => {
    const data = await PoojaModel.getAddonsByPooja(
        req.params.poojaId
    );

    res.json({
        success: true,
        data,
    });
};
