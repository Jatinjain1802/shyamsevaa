import * as ChadawaModel from "../models/chadawas.model.js";

/* ================= CHADAWA ================= */

export const createChadawa = async (req, res) => {
    const { title, image, description, benefits, chadawa_date } = req.body;

    const chadawaId = await ChadawaModel.createChadawa({
        title,
        image,
        description,
        benefits,
        chadawa_date,
    });

    res.status(201).json({ success: true, chadawaId });
};

export const updateChadawa = async (req, res) => {
    const updated = await ChadawaModel.updateChadawa(req.params.chadawaId, req.body);
    if (!updated) return res.status(404).json({ success: false });
    res.json({ success: true });
};

export const deleteChadawa = async (req, res) => {
    const deleted = await ChadawaModel.deleteChadawa(req.params.chadawaId);
    if (!deleted) return res.status(404).json({ success: false });
    res.json({ success: true });
};

/* ================= ITEMS ================= */

export const addChadawaItem = async (req, res) => {
    const { title, description, price } = req.body;
    const itemId = await ChadawaModel.addChadawaItem(req.params.chadawaId, {
        title,
        description,
        price,
    });
    res.json({ success: true, itemId });
};

export const updateChadawaItem = async (req, res) => {
    const updated = await ChadawaModel.updateChadawaItem(req.params.itemId, req.body);
    res.json({ success: true, updated });
};

export const deleteChadawaItem = async (req, res) => {
    await ChadawaModel.deleteChadawaItem(req.params.itemId);
    res.json({ success: true });
};

/* ================= BENEFITS ================= */

export const addChadawaBenefit = async (req, res) => {
    const { title, description } = req.body;
    const id = await ChadawaModel.addChadawaBenefit(req.params.chadawaId, {
        title,
        description,
    });
    res.json({ success: true, id });
};

export const deleteChadawaBenefit = async (req, res) => {
    await ChadawaModel.deleteChadawaBenefit(req.params.benefitId);
    res.json({ success: true });
};

/* ================= TEMPLE MAP ================= */

export const mapChadawaTemple = async (req, res) => {
    const { temple_id } = req.body;
    await ChadawaModel.mapChadawaTemple(req.params.chadawaId, temple_id);
    res.json({ success: true });
};

/* ================= USER ================= */

export const getChadawaDetail = async (req, res) => {
    const chadawaId = req.params.chadawaId;

    const chadawa = await ChadawaModel.getChadawaById(chadawaId);
    if (!chadawa) return res.status(404).json({ success: false });

    const [items, benefits, temples, reviews] = await Promise.all([
        ChadawaModel.getChadawaItems(chadawaId),
        ChadawaModel.getChadawaBenefits(chadawaId),
        ChadawaModel.getChadawaTemples(chadawaId),
        ChadawaModel.getChadawaReviews(chadawaId),
    ]);

    res.json({
        success: true,
        data: { chadawa, items, benefits, temples, reviews },
    });
};

export const getChadawasByTemple = async (req, res) => {
    const data = await ChadawaModel.getChadawasByTemple(req.params.templeId);
    res.json({ success: true, data });
};
