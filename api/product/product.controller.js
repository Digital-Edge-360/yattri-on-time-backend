const { Product } = require("../../models/Product");
const { uploadFile, deleteFile } = require("../../services/aws.service");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      specification1,
      specification2,
      specification3,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !specification1 ||
      !specification2 ||
      !specification3
    ) {
      return res.status(400).json({
        message:
          "A product must have a name,description,price and all the specifications",
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No Image Uploaded" });
    }

    if (file.size > 10000000)
      return res
        .status(400)
        .json({ message: "Image should be less than 10 MB" });

    const result = await uploadFile(file);

    const product = await Product.create({
      ...req.body,
      createdAt: Date.now(),
      image: result.Location,
    });

    return res.status(201).json({ data: product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    if (products.length == 0)
      return res.status(404).json({ message: "No product found" });

    return res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) return res.status(404).json({ message: "No product found" });

    return res.status(200).json({ data: product });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) return res.status(404).json({ message: "No product found" });
    let fileLink = product.image;

    if (req.file) {
      await deleteFile(product);
      const result = await uploadFile(req.file);
      fileLink = result.Location;
    }

    const {
      name,
      description,
      price,
      inStock,
      specification1,
      specification2,
      specification3,
    } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        name,
        description,
        price,
        image: fileLink,
        inStock,
        specification1,
        specification2,
        specification3,
      },
      {
        new: true,
      }
    );

    return res.status(201).json({ data: updatedProduct });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const rateProduct = async (req, res) => {
  try {
    const { userId } = req; // from validated token
    const { productId, rating } = req.body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be number 1-5" });
    }

    const product = await Product.findOne({ _id: req.params.id }).select(
      "ratings avgRating"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Initialize ratings if null
    if (!product.ratings) {
      product.ratings = [];
    }

    // Migrate ratings without user
    const hasInvalidRating = product.ratings.some((r) => !r.user);

    if (hasInvalidRating) {
      product.ratings = product.ratings.filter((r) => r.user);
      await product.save();
    }
    // Add new rating
    product.ratings.push({
      user: userId,
      rating,
    });

    // Calculate avg rating
    const ratingsSum = product.ratings.reduce((s, r) => s + r.rating, 0);
    const ratingsCount = product.ratings.length;
    const avgRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

    const existingRating = product.ratings.find((r) => r.user.equals(userId));

    if (existingRating) {
      // update
      existingRating.rating = rating;
    } else {
      // new rating
      product.ratings.push({ user: userId, rating });
    }

    product.avgRating = avgRating;

    product.avgRating = await Product.aggregate([
      { $match: { _id: productId } },
      {
        $project: {
          _id: 0,
          avgRating: { $avg: "$ratings.rating" },
        },
      },
    ]);

    await product.save();

    // calculate confidence
    const confidence = wilsonScore(product);

    res.json({
      avgRating: product.avgRating,
      confidence,
    });

    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) return res.status(400).json({ message: "No product found" });
    await deleteFile(product);
    await Product.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  rateProduct,
};
