import Product from "../classes/Product.js";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/db.js";
import * as XLSX from "xlsx";
import AdmZip from "adm-zip";
import streamifier from "streamifier";

export const createProduct = async(req, res) => {
    try {
    const {
      name,
      brand,
      category,
      subCategory,
      price,
      size,
      stock,
      description,
      warnings = [],
      directions,
      additionalInfo = {},
      variants = {},
    } = req.body;

    // Validate uploaded images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Map uploaded files to paths
   const imageUploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        ).end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(imageUploadPromises);

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        category,
        subCategory,
        price: Number(price),
        size,
        stock: Number(stock),
        description,
        warnings: Array.isArray(warnings) ? warnings : [warnings],
        directions,
        additionalInfo: JSON.parse(additionalInfo || "{}"),
        variants: JSON.parse(variants || "{}"),
        images: imageUrls,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const uploadbulkproducts = async (req, res) => {
  try {
    // 1️⃣ Check files
    if (!req.files || !req.files["excel"] || !req.files["images"]) {
      return res.status(400).json({ error: "Excel and ZIP files are required" });
    }

    const excelFile = req.files["excel"][0];
    const zipFile = req.files["images"][0];

    // 2️⃣ Read Excel
    const workbook = XLSX.read(excelFile.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    // 3️⃣ Extract ZIP in memory
    const zip = new AdmZip(zipFile.buffer);
    const zipEntries = zip.getEntries(); // array of files in ZIP
    const imagesMap = {};
    zipEntries.forEach((entry) => {
      if (!entry.isDirectory) {
        imagesMap[entry.entryName] = entry.getData(); // map filename => buffer
      }
    });

    // 4️⃣ Map Excel rows to products
    const products = [];

    for (const row of rows) {
      const productImages = [];
      if (row.images) {
        const imageNames  = row.images.split("|"); // filenames in Excel
        for (const name of imageNames) {
          const buffer = imagesMap[name.trim()];
          if (!buffer) {
            console.warn(`Image ${name} not found in ZIP`);
            continue;
          }

          // Upload to Cloudinary
          const url = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "products" },
              (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
              }
            );
            streamifier.createReadStream(buffer).pipe(uploadStream);
          });

          productImages.push(url);
        }
      }

      products.push({
        name: row.name,
        brand: row.brand || null,
        category: row.category,
        subCategory: row.subCategory || null,
        price: parseFloat(row.price),
        size: row.size || null,
        stock: parseInt(row.stock),
        description: row.description || null,
        warnings: row.warnings ? row.warnings.split("|") : [],
        directions: row.directions || null,
        additionalInfo: row.additionalInfo ? JSON.parse(row.additionalInfo) : {},
        variants: row.variants ? JSON.parse(row.variants) : {},
        images: productImages,
      });
    }

    // 5️⃣ Insert into DB (one by one to handle JSON properly)
    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    res.json({ message: `Successfully uploaded ${products.length} products` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};