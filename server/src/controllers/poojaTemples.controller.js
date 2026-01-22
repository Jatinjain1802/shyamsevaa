import * as Model from "../models/poojaTemples.model.js";

export const getPoojaTemples = async (req, res) => {
    const data = await Model.getTemplesByPooja(req.params.poojaId);
    res.json({ success: true, data });
};

export const addTempleToPooja = async (req, res) => {
    const { temple_id } = req.body;
    const { poojaId } = req.params;

    const mapId = await Model.linkTempleToPooja(poojaId, temple_id);

    res.json({
        success: true,
        message: "Temple linked to pooja",
        mapId,
    });
};

export const removeTempleFromPooja = async (req, res) => {
    await Model.unlinkTempleFromPooja(req.params.mapId);
    res.json({
        success: true,
        message: "Temple unlinked",
    });
};
