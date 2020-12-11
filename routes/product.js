const express = require('express')
const router = express.Router();
const product = require('../controllers/productController')

// @desc    Display add product page
// @route   @GET /product/add 
// @access  Private(registered as Farmers only) 
router.get("/add", product.displayAddProduct);

// @desc    Submit on add product page
// @route   @POST /product/add 
// @access  Private(registered as Farmers only) 
router.post("/add", product.addProduct);

// @desc    To see details of a product
// @route   @GET /product/:id 
// @access  Private(registered only) 
router.get("/:id", product.displayProduct);

module.exports = router;