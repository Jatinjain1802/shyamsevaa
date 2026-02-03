import * as ChadawaModel from "../models/chadawas.model.js";

/* ================= CHADAWA ================= */

export const createChadawa = async (req, res) => {
    try {
        const { title, image, description, benefits, chadawa_date } = req.body;

        // Handle file upload
        let imagePath = image;
        if (req.files && req.files['chadawa_image']) {
            imagePath = `/uploads/chadawas/${req.files['chadawa_image'][0].filename}`;
        } else if (req.file) {
            imagePath = `/uploads/chadawas/${req.file.filename}`;
        }

        const chadawaId = await ChadawaModel.createChadawa({
            title,
            image: imagePath,
            description,
            benefits,
            chadawa_date,
        });

        // Handle Gallery Images
        if (req.files && req.files['chadawa_gallery']) {
            const galleryFiles = req.files['chadawa_gallery'];
            let galleryDescriptions = req.body.gallery_description || [];

            if (!Array.isArray(galleryDescriptions)) {
                galleryDescriptions = [galleryDescriptions];
            }

            for (let i = 0; i < galleryFiles.length; i++) {
                const file = galleryFiles[i];
                const description = galleryDescriptions[i] || "";
                const galleryPath = `/uploads/chadawas/${file.filename}`;
                await ChadawaModel.addChadawaImage(chadawaId, galleryPath, description);
            }
        }

        res.status(201).json({ success: true, chadawaId });
    } catch (error) {
        console.error("Create chadawa error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateChadawa = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Handle file upload
        if (req.files && req.files['chadawa_image']) {
            updateData.image = `/uploads/chadawas/${req.files['chadawa_image'][0].filename}`;
        } else if (req.file) {
            updateData.image = `/uploads/chadawas/${req.file.filename}`;
        }

        const updated = await ChadawaModel.updateChadawa(req.params.chadawaId, updateData);

        // Append Gallery Images
        if (req.files && req.files['chadawa_gallery']) {
            const galleryFiles = req.files['chadawa_gallery'];
            let galleryDescriptions = req.body.gallery_description || [];

            if (!Array.isArray(galleryDescriptions)) {
                galleryDescriptions = [galleryDescriptions];
            }

            for (let i = 0; i < galleryFiles.length; i++) {
                const file = galleryFiles[i];
                const description = galleryDescriptions[i] || "";
                const galleryPath = `/uploads/chadawas/${file.filename}`;
                await ChadawaModel.addChadawaImage(req.params.chadawaId, galleryPath, description);
            }
        }

        // if (!updated) return res.status(404).json({ success: false, message: "Chadawa not found" });
        // Allowing update even if only gallery images are added (update might return 0)
        res.json({ success: true });
    } catch (error) {
        console.error("Update chadawa error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteChadawaGalleryImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const deleted = await ChadawaModel.deleteChadawaImage(imageId);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }
        res.json({ success: true, message: "Image deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
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

export const removeChadawaTemple = async (req, res) => {
    await ChadawaModel.deleteChadawaTemple(req.params.chadawaId, req.params.templeId);
    res.json({ success: true });
};

export const getLinkedTemples = async (req, res) => {
    const temples = await ChadawaModel.getChadawaTemples(req.params.chadawaId);
    res.json({ success: true, data: temples });
};

/* ================= USER ================= */

export const getChadawaDetail = async (req, res) => {
    const chadawaId = req.params.chadawaId;

    const chadawa = await ChadawaModel.getChadawaById(chadawaId);
    if (!chadawa) return res.status(404).json({ success: false });

    const [items, benefits, temples, reviews, gallery] = await Promise.all([
        ChadawaModel.getChadawaItems(chadawaId),
        ChadawaModel.getChadawaBenefits(chadawaId),
        ChadawaModel.getChadawaTemples(chadawaId),
        ChadawaModel.getChadawaReviews(chadawaId),
        ChadawaModel.getChadawaImages(chadawaId),
    ]);

    res.json({
        success: true,
        data: { chadawa, items, benefits, temples, reviews, gallery },
    });
};

export const getChadawasByTemple = async (req, res) => {
    const data = await ChadawaModel.getChadawasByTemple(req.params.templeId);
    res.json({ success: true, data });
};
export const getAllChadawas = async (req, res) => {
    const data = await ChadawaModel.getAllChadawas();
    res.json({ success: true, data });
}

