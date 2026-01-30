import Product from "../classes/Product.js";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/db.js";
import * as XLSX from "xlsx";
import AdmZip from "adm-zip";
import streamifier from "streamifier";

export const createProduct = async (req, res) => {
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
      variantType,
      secondaryVariantName = "Flavor",
      variants = [],
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

    // Parse variants if they come as a JSON string
    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    // Ensure numeric values
    parsedVariants = parsedVariants.map(v => ({
      size: v.size,
      flavor: v.flavor || null,
      price: Number(v.price),
      stock: Number(v.stock)
    }));

    // Minimum price for the product overview
    const basePrice = parsedVariants.length > 0
      ? Math.min(...parsedVariants.map(v => v.price))
      : Number(price);

    const totalStock = parsedVariants.length > 0
      ? parsedVariants.reduce((sum, v) => sum + v.stock, 0)
      : Number(stock);

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        category,
        subCategory,
        price: basePrice,
        stock: totalStock,
        description,
        warnings: Array.isArray(warnings) ? warnings : [warnings],
        directions,
        images: imageUrls,
        variantType: variantType || 'SIZE',
        secondaryVariantName,
        variants: {
          create: parsedVariants
        }
      },
      include: {
        variants: true
      }
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
        const imageNames = row.images.split("|"); // filenames in Excel
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

      // Parse variants: format "size:price:stock|size:price:stock"
      const variantData = row.variants
        ? row.variants.split("|").map(v => {
          const parts = v.split(":");
          if (parts.length === 4) {
            // size:flavor:price:stock
            return {
              size: parts[0].trim(),
              flavor: parts[1].trim(),
              price: parseFloat(parts[2]),
              stock: parseInt(parts[3])
            };
          } else {
            // size:price:stock
            const [size, price, stock] = parts;
            return {
              size: size.trim(),
              flavor: null,
              price: parseFloat(price),
              stock: parseInt(stock)
            };
          }
        })
        : [];

      const basePrice = variantData.length > 0
        ? Math.min(...variantData.map(v => v.price))
        : parseFloat(row.price || 0);

      const totalStock = variantData.length > 0
        ? variantData.reduce((sum, v) => sum + v.stock, 0)
        : parseInt(row.stock || 0);

      products.push({
        name: row.name,
        brand: row.brand || null,
        category: row.category,
        subCategory: row.subCategory || null,
        price: basePrice,
        stock: totalStock,
        description: row.description || null,
        warnings: row.warnings ? row.warnings.split("|") : [],
        directions: row.directions || null,
        images: productImages,
        variantType: row.variantType ? row.variantType.toUpperCase() : 'SIZE',
        secondaryVariantName: row.secondaryVariantName || 'Flavor',
        variants: variantData
      });
    }

    // 5️⃣ Insert into DB
    for (const product of products) {
      const { variants, ...productData } = product;
      await prisma.product.create({
        data: {
          ...productData,
          variants: {
            create: variants
          }
        }
      });
    }

    res.json({ message: `Successfully uploaded ${products.length} products` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};




// export const getallproducts=async(req,res)=>{
// const product= await prisma.product.findMany();
// if(product.length===0){
// return res.status(401).json({message:"no products found"})
// }
// res.status(201).send(product);
// }

export const getallproducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      search,
      minPrice,
      maxPrice,
      sort = "newest",
      page = "1",
      limit = "12",
      inStock,
      rating,
    } = req.query;

    const where = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (subCategory) {
      where.subCategory = subCategory;
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { brand: { contains: String(search), mode: "insensitive" } },
        { id: { equals: String(search) } }, // <-- added ID search
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {
        gte: minPrice ? Number(minPrice) : 0,
        lte: maxPrice ? Number(maxPrice) : 999999,
      };
    }

    if (inStock === "true") {
      where.stock = { gt: 0 };
    }

    if (rating) {
      where.rating = { gte: Number(rating) };
    }

    let orderBy = { createdAt: "desc" };

    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "name") orderBy = { name: "asc" };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: Number(limit),
        include: {
          variants: true
        }
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true, subCategory: true },
    });

    const categoryMap = {};
    products.forEach(p => {
      if (!categoryMap[p.category]) {
        categoryMap[p.category] = new Set();
      }
      if (p.subCategory) {
        categoryMap[p.category].add(p.subCategory);
      }
    });

    const result = Object.keys(categoryMap).map(cat => ({
      name: cat,
      subCategories: Array.from(categoryMap[cat])
    }));

    res.json({ categories: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      category,
      subCategory,
      price,
      size,
      stock,
      description,
      warnings,
      directions,
      variantType,
      secondaryVariantName,
      variants,
      existingImages // Array of image URLs to keep
    } = req.body;

    let imageUrls = [];
    if (existingImages) {
      imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
    }

    // Handle new image uploads if any
    if (req.files && req.files.length > 0) {
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
      const newImageUrls = await Promise.all(imageUploadPromises);
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    // Handle variants update: easiest is to delete and recreate for this simplified flow
    // A more complex update would diff them.
    let variantUpdate = {};
    if (variants) {
      const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;

      const basePrice = parsedVariants.length > 0
        ? Math.min(...parsedVariants.map(v => Number(v.price)))
        : undefined;

      const totalStock = parsedVariants.length > 0
        ? parsedVariants.reduce((sum, v) => sum + Number(v.stock), 0)
        : undefined;

      variantUpdate = {
        price: basePrice,
        stock: totalStock,
        variantType: variantType,
        secondaryVariantName: secondaryVariantName,
        variants: {
          deleteMany: {}, // Wipe existing variants
          create: parsedVariants.map(v => ({
            size: v.size,
            flavor: v.flavor || null,
            price: Number(v.price),
            stock: Number(v.stock)
          }))
        }
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        brand,
        category,
        subCategory,
        description,
        warnings: warnings ? (Array.isArray(warnings) ? warnings : JSON.parse(warnings)) : undefined,
        directions,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        ...variantUpdate
      },
      include: {
        variants: true
      }
    });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // We could either hard delete or soft delete. 
    // Given the 'isActive' field in schema, a soft delete is better.
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: "Product decommissioned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
