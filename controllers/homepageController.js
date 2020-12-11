const express = require('express');

const saltRounds = 10 
const bcrypt = require('bcrypt')
// const driver = require('../config/db');
const productResolver = require('../resolvers/productResolvers');

// GET /homepage
module.exports.displayPage = (req,res) => {
    const sess = req.session;
    if(sess.user != undefined) {

        productResolver.getAllProducts()
            .then(result => {
                if (result === undefined) {
                    res.render('homepage',{
                        user: sess.user,
                        msg: "An error occured. Try Again later"
                    })
                } else {
                    // console.log(result)
                    res.render('homepage',{
                        user: sess.user,
                        products: result
                    })
                }
            })
    } else {
        res.redirect("/user/login");
    }
}
