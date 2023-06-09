const brandService = require("../services/brand.service");
const Brands = require("../model/Brand.js");

// add a brand
exports.addBrand = async (req, res) => {
  try {
    const result = await brandService.addBrandService(req.body);
    res.status(200).json({
      status: "success",
      message: "Brand created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

// add all Brand
exports.addAllBrand = async (req, res) => {
  try {
    const result = await brandService.addAllBrandService(req.body);
    res.json({
      message: "Brands added successfully",
      result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// get active Brand
exports.getActiveBrands = async (req, res) => {
  try {
    const result = await brandService.getBrandsService();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
