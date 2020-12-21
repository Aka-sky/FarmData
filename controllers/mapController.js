const express = require('express');

const saltRounds = 10 
const bcrypt = require('bcrypt')
// const driver = require('../config/db');
const mapResolver = require('../resolvers/mapResolvers');

// GET /map
module.exports.displayMap = (req,res) => {
    const sess = req.session;
    if(sess.user != undefined) {
        if(sess.user.labels.includes('Buyer')) {

            mapResolver.getAllSellers(sess.user.username, 500)
                .then(result => {
                    if(result == undefined || !result) {
                        res.render('map' , {
                            user: sess.user,
                            sellers: JSON.stringify([]),
                            msg: 'Error occured!!',
                            accessToken: process.env.MAPBOX_API_KEY
                        })
                    } else {
                        res.render('map',{
                            user: sess.user,
                            sellers: JSON.stringify(result),
                            accessToken: process.env.MAPBOX_API_KEY
                        })
                    }
                })

        } else {
            res.redirect("/homepage")
        }
    } else {
        res.redirect("/user/login");
    }
}
