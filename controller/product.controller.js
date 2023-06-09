const Brand = require("../model/Brand");
const productServices = require("../services/product.service");

// add product
exports.addProduct = async (req, res) => {
  try {
    const result = await productServices.createProductService(req.body);
    res.status(200).json({
      status: "success",
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

// add all product
module.exports.addAllProducts = async (req, res) => {
  try {
    const result = await productServices.addAllProductService(req.body);
    res.json({
      message: "Products added successfully",
      result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// get all products
module.exports.getAllProducts = async (req, res) => {
  try {
    const result = await productServices.getAllProductsService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// get all products by type
module.exports.getProductsByType = async (req, res) => {
  try {
    const result = await productServices.getProductTypeService(req);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

// get offer product controller
module.exports.getOfferTimerProducts = async (req, res) => {
  try {
    const result = await productServices.getOfferTimerProductService(
      req.query.type
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// get Popular Product By Type
module.exports.getPopularProductByType = async (req, res) => {
  try {
    const result = await productServices.getPopularProductServiceByType(
      req.params.type
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// get top rated Products
module.exports.getTopRatedProducts = async (req, res) => {
  try {
    const result = await productServices.getTopRatedProductService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// getSingleProduct
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await productServices.getProductService(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get Related Product
exports.getRelatedProducts = async (req, res) => {
  try {
    const products = await productServices.getRelatedProductService(
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
