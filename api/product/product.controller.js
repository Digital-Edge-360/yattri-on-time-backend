const { Product } = require("../../models/Product");
const { uploadFile, deleteFile } = require("../../services/aws.service");

const addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ message: "A product must have a name,description and price" });
    }

    const file = req.file;

    if (file.size > 10000000)
      return res
        .status(400)
        .json({ message: "Image should be less than 10 MB" });

    if (!file) {
      return res.status(400).json({ message: "Product must have an image" });
    }

    const result = await uploadFile(file);

    const product = await Product.create({
      ...req.body,
      createdAt: Date.now(),
      image: result.Location,
    });

    return res.status(201).json({ data: product });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
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

    const { name, description, price, inStock } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { name, description, price, image: fileLink, inStock },
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
};
