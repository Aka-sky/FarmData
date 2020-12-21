const express = require('express')
const router = express.Router();
// const driver = require('../config/db') 
const map = require('../controllers/mapController')

// @desc    Display map page
// @route   @GET /map
// @access  Private(registered as Buyers only)
router.get("/", map.displayMap);

module.exports = router