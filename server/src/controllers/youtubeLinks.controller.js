import * as YoutubeModel from "../models/youtubeLinks.model.js";

export const getAllLinks = async (req, res) => {
  try {
    const links = await YoutubeModel.getAll();
    res.json({ success: true, data: links });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getActiveLinks = async (req, res) => {
  try {
    const links = await YoutubeModel.getActive();
    res.json({ success: true, data: links });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLink = async (req, res) => {
  try {
    const id = await YoutubeModel.create(req.body);
    res.json({ success: true, id, message: "YouTube link created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLink = async (req, res) => {
  try {
    await YoutubeModel.update(req.params.id, req.body);
    res.json({ success: true, message: "YouTube link updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const fetchVideoMetadata = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, message: "URL is required" });

    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      return res.status(400).json({ success: false, message: "Could not fetch metadata from YouTube" });
    }

    const data = await response.json();
    res.json({
      success: true,
      data: {
        title: data.title,
        thumbnail: data.thumbnail_url,
        author: data.author_name
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLink = async (req, res) => {
  try {
    await YoutubeModel.remove(req.params.id);
    res.json({ success: true, message: "YouTube link deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
