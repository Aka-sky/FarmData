const express = require('express')
const router = express.Router();
const driver = require('../config/db') 
const homepage = require('../controllers/homepageController')

// @desc    Display homepage page
// @route   @GET /hompage
// @access  Private(registered only)
router.get("/", homepage.displayPage);

module.exports = router