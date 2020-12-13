const express = require('express')
const router = express.Router();
const request = require('../controllers/requestController')

// @desc    See Requests of a user
// @route   @GET /request 
// @access  Private(registered Buyer'/Seller's only) 
router.post("/request", request.getAllRequests);

// @desc    Request for a product
// @route   @POST /product/request/:id 
// @access  Private(registered Buyer's only) 
router.post("/request/:id", request.makeRequest);

module.exports = router