const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const saltRounds = 10 
const bcrypt = require('bcrypt')
const driver = require('../config/db') ;

// @desc    Display login page
// @route   @GET /user/login
// @access  Public(non registered)
router.get("/login", userController.login);

// @desc    Submit on login page
// @route   @POST /user/login
// @access  Public(non registered)
router.post("/login", userController.createSession);

// @desc    Display signup page
// @route   @GET /user/signup
// @access  Public(non registered)
router.get("/signup", userController.signup);

// @desc    Submit on signup page
// @route   @POST /user/signup
// @access  Public(non registered)
router.post("/signup", userController.create);


module.exports = router;


