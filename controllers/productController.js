const express = require('express');
const productResolver = require('../resolvers/productResolvers');

// GET /product/add
module.exports.displayAddProduct = (req,res) => {
    const sess = req.session;
    if(sess.user != undefined) {
        if(sess.user.labels.includes('Farmer')) {
            res.render("addProduct",{
                user: sess.user
            })
        } else {
            res.redirect("/homepage")
        }
    } else {
        sess.redirectURL = "/product/add"
        res.redirect("/user/login");
    }
}

// POST /product/add
module.exports.addProduct = (req,res) => {
    const sess = req.session;
    const product = req.body;

    if(product.productImageURL == "") {
        product.productImageURL = "../images/plant.svg"
    }

    productResolver.addProduct(sess.user, product)
        .then(result => {
            if(result === undefined || !result) {
                res.render('addProduct',{
                    msg: "An error occured! Try Again later.",
                    user: sess.user,
                    category: product.category,
                    name: product.name,
                    description: product.description,
                    condition: product.condition,
                    unit: product.unit,
                    price: product.price,
                    productImageURL: product.productImageURL
                })
            } else {
                res.render("addProduct",{
                    msg: "Product Added successfully!",
                    user: sess.user
                })
            }
        })
}

// GET product/:id
module.exports.displayProduct = (req,res) => {
    const sess = req.session;
    const product_id = req.params.id;
    // console.log(product_id)
    if(sess.user != undefined) {

        productResolver.getProductById(product_id)
        .then(result => {
            if(result == undefined || result == 0) {
                res.render('product',{
                    msg: "Invaild URL",
                    user: sess.user,
                    seller: ''
                })
            } else {
                productResolver.getSeller(product_id)
                    .then(seller => {
                        if(seller == undefined || !seller) {
                            res.render("product", {
                                msg: "Not Found",
                                user: sess.user
                            })
                        } else {
                            productResolver.getCommentsForProduct(product_id)
                                .then(comments => {
                                    res.render('product',{
                                        msg: (req.message != undefined ? req.message : ""),
                                        user: sess.user,
                                        product: result,
                                        seller,
                                        product_id,
                                        comments: comments,
                                        accessToken: process.env.MAPBOX_API_KEY
                                    })
                                })
                        }
                    })
            }
        })
    } else {
        sess.redirectURL = `/product/${product_id}`;
        res.redirect('/user/login');
    }
}

module.exports.addComment = (req,res) => {

    const sess = req.session;
    const product_id = req.params.id;
    const comment = req.body;
    // console.log(comment)
    productResolver.addComment(comment, product_id, sess.user.username)
        .then(result => {
            if(result == undefined || !result) {
                sess.message = "Comment couldn't be added.";
                res.redirect(`/product/${product_id}`);
            } else {
                // console.log(result)
                res.redirect(`/product/${product_id}`);
            }
        })
}