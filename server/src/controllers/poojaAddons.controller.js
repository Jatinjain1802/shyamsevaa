
import * as PoojaModel from "../models/poojaAddons.model";
/* =======================
   ADDONS (ADMIN)
======================= */

export const createAddon = async (req, res) => {
    const { title, image, description, price, is_common } = req.body;

    if (!title || !price) {
        return res.status(400).json({
            success: false,
            message: "Title and price are required",
        });
    }

    const addonId = await PoojaModel.createAddon({
        title,
        image,
        description,
        price,
        is_common,
    });

    res.status(201).json({
        success: true,
        message: "Addon created",
        addonId,
    });
};

export const updateAddon = async (req, res) => {
    const updated = await PoojaModel.updateAddon(
        req.params.addonId,
        req.body
    );

    if (!updated) {
        return res.status(404).json({
            success: false,
            message: "Addon not found",
        });
    }

    res.json({ success: true, message: "Addon updated" });
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
    const { addon_id } = req.body;
    const { poojaId } = req.params;

    const mapId = await PoojaModel.mapAddonToPooja(
        poojaId,
        addon_id
    );

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
