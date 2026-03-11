import * as poojaFaqModel from "../models/pojaFaq.model.js";
import { translateObject } from "../utils/translation.js";

/* ================= GET FAQs BY POOJA ================= */
export const getPoojaFaqs = async (req, res) => {
    try {
        const poojaId = req.params.poojaId;

        const faqs = await poojaFaqModel.getFaqsByPoojaId(poojaId);

        return res.status(200).json({
            success: true,
            data: faqs,
        });

    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch FAQs",
        });
    }
};


/* ================= CREATE FAQ ================= */
export const createPoojaFaq = async (req, res) => {
    try {
        const { pooja_id, question, answer, sort_order } = req.body;

        if (!pooja_id || !question || !answer) {
            return res.status(400).json({
                success: false,
                message: "Pooja ID, question and answer are required",
            });
        }

        // Auto-translate to Hindi
        const translations = await translateObject({ question, answer }, ["question", "answer"]);

        const faqId = await poojaFaqModel.createFaq({
            pooja_id,
            question,
            ...translations,
            answer,
            sort_order,
        });

        return res.status(201).json({
            success: true,
            message: "FAQ created successfully",
            faqId,
        });

    } catch (error) {
        console.error("Error creating FAQ:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create FAQ",
        });
    }
};


/* ================= DELETE FAQ ================= */
export const deletePoojaFaq = async (req, res) => {
    try {
        const { faqId } = req.params;

        await poojaFaqModel.deleteFaq(faqId);

        return res.status(200).json({
            success: true,
            message: "FAQ deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting FAQ:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete FAQ",
        });
    }
};
