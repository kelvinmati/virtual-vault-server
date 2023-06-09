const express = require('express');
const router = express.Router();
// internal
const brandController = require('../controller/brand.controller');

// add Brand
router.post('/add',brandController.addBrand);
// add All Brand
router.post('/add-all',brandController.addAllBrand);
// get Active Brands
router.get('/active',brandController.getActiveBrands);

module.exports = router;