const express = require('express');
const router = express.Router();
// internal
const categoryController = require('../controller/category.controller');

// add
router.post('/add', categoryController.addCategory);
// add All Category
router.post('/add-all', categoryController.addAllCategory);
// get Show Category
router.get('/show', categoryController.getShowCategory);
// get Product Type Category
router.get('/show/:type', categoryController.getProductTypeCategory);

module.exports = router;