const categoryServices = require("../services/category.service");


// add category
exports.addCategory = async (req,res) => {
  try {
    const result = await categoryServices.createCategoryService(req.body);
    res.status(200).json({
      status: "success",
      message: "Category created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:error.message
    })
  }
}

// add all category
exports.addAllCategory = async (req,res) => {
  try {
    const result = await categoryServices.addAllCategoryService(req.body);
    res.json({
      message:'Category added successfully',
      result,
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}

// add all category
exports.getShowCategory = async (req,res) => {
  try {
    const result = await categoryServices.getShowCategoryServices();
    res.status(200).json({
      success:true,
      result,
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}


// add all category
exports.getProductTypeCategory = async (req,res) => {
  try {
    const result = await categoryServices.getCategoryTypeService(req.params.type);
    res.status(200).json({
      success:true,
      result,
    })
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}