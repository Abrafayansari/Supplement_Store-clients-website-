import { prisma } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

export const getBanners = async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        res.json(banners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch banners" });
    }
};

export const createBanner = async (req, res) => {
    try {
        const { title, link } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        // Upload to Cloudinary
        const imageUrl = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "banners" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            ).end(req.file.buffer);
        });

        const banner = await prisma.banner.create({
            data: {
                image: imageUrl,
                title,
                link,
            },
        });

        res.status(201).json({ message: "Banner created successfully", banner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create banner" });
    }
};

export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        // Optional: Delete from cloudinary if we had the public_id
        // For now, just remove from DB
        await prisma.banner.delete({
            where: { id },
        });

        res.json({ message: "Banner deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete banner" });
    }
};
