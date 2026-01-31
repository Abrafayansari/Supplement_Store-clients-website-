import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/db.js";

export const createBundle = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            productIds = [],
        } = req.body;

        let imageUrl = null;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "bundles" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                ).end(req.file.buffer);
            });
            imageUrl = result;
        }

        // Parse productIds if sent as JSON string
        const parsedProductIds = typeof productIds === 'string' ? JSON.parse(productIds) : productIds;

        const bundle = await prisma.bundle.create({
            data: {
                name,
                description,
                price: Number(price),
                originalPrice: originalPrice ? Number(originalPrice) : null,
                image: imageUrl,
                products: {
                    connect: parsedProductIds.map(id => ({ id }))
                }
            },
            include: {
                products: true
            }
        });

        return res.status(201).json({
            message: "Bundle created successfully",
            bundle,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export const getBundles = async (req, res) => {
    try {
        const bundles = await prisma.bundle.findMany({
            where: { isActive: true },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        images: true,
                        price: true
                    }
                }
            }
        });
        res.json(bundles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch bundles" });
    }
};

export const getBundleById = async (req, res) => {
    try {
        const { id } = req.params;
        const bundle = await prisma.bundle.findUnique({
            where: { id },
            include: { products: true }
        });
        if (!bundle) return res.status(404).json({ message: "Bundle not found" });
        res.json(bundle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch bundle" });
    }
};

export const updateBundle = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            originalPrice,
            productIds = [],
            existingImage
        } = req.body;

        let imageUrl = existingImage;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "bundles" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                ).end(req.file.buffer);
            });
            imageUrl = result;
        }

        const parsedProductIds = typeof productIds === 'string' ? JSON.parse(productIds) : productIds;

        const bundle = await prisma.bundle.update({
            where: { id },
            data: {
                name,
                description,
                price: Number(price),
                originalPrice: originalPrice ? Number(originalPrice) : null,
                image: imageUrl,
                products: {
                    set: parsedProductIds.map(id => ({ id }))
                }
            },
            include: {
                products: true
            }
        });

        res.json({ message: "Bundle updated successfully", bundle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteBundle = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.bundle.update({
            where: { id },
            data: { isActive: false }
        });
        res.json({ message: "Bundle deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
