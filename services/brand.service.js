const Brand = require("../model/Brand");

// addBrandService
module.exports.addBrandService = async (data) => {
  const brand = await Brand.create(data);
  return brand;
};

// create all Brands service
exports.addAllBrandService = async (data) => {
  await Brand.deleteMany();
  const brands = await Brand.insertMany(data);
  return brands;
};

// create all Brands service
exports.getBrandsService = async () => {
  const brands = await Brand.find({ status: "active" }).populate("products");
  return brands;
};
