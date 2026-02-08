import * as SearchModel from "../models/search.model.js";

export const search = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const results = await SearchModel.searchGlobal(q);

        return res.json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
