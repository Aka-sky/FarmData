const express = require('express');
const requestResolver = require('../resolvers/requestResolvers');


module.exports.getAllRequests = (req,res) => {
    const sess = req.session;

    if(sess.user != undefined) {

        if(sess.user.labels.includes('Farmer')) {
            // get all requests received for products
            requestResolver.getAllRequestsReceived(sess.user.username)
                .then(result => {
                    if(result == undefined) {
                        res.send("error")
                    } else if (result == 0) {
                        res.render('request',{
                            user:sess.user,
                            requests: []
                        })
                    } else {
                        res.render('request',{
                            user: sess.user,
                            requests: result
                        })
                    }
                })
            } else {
                // get all requests made by this user
                requestResolver.getAllRequestsMade(sess.user.username)
                .then(result => {
                    if(result == undefined) {
                        res.send("error")
                        
                    } else if (result == 0) {
                        res.render('request',{
                            user:sess.user,
                            requests: []
                        })
                    } else {
                        res.render('request',{
                            user: sess.user,
                            requests: result
                        })
                    }
                })

        }

    }
}

module.exports.makeRequest = (req,res) => {
    
    const sess = req.session;
    const quantity = req.body;
    const product_id = req.params.id;
    
    requestResolver.makeRequest(quantity, product_id, sess.user.username)
        .then(result => {
            if(result == undefined || !result) {
                res.send("Error occured try again later")
            } else {
                res.redirect("/request")
            }
        })
}