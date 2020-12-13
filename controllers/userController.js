const express = require('express');
const saltRounds = 10 
const bcrypt = require('bcrypt');
const resolver = require('../resolvers/userResolver');

// GET user /user/login
module.exports.login = (req,res) => {
    const sess = req.session;
    
    if(sess.username) {
        res.redirect("/homepage");
    } else {
        res.render("login", {
            msg: "",
            username: "",
            password: "",
        })
    }
}

// // POST user/login

module.exports.createSession = (req,res) => {
    const sess = req.session;
    const user = req.body;
    resolver.getUser(user.username)
        .then((result) => {

            if(result === undefined) {
                console.log("result undefined")
                res.render('login',{
                    msg: "An error occured. Try Again later",
                    username: "",
                    password: ""
                })
            } else if (result) {
                bcrypt.compare(user.password, result.password, (err,match)=>{
                    if(err) {
                        // console.log(err.message)
                        res.render('login',{
                            msg: "An error occured. Try Again later",
                            username: "",
                            password: ""
                        })
                    } else if (match) {
                        sess.user = {
                            username: user.username,
                            labels: result.labels
                        }
        
                        if(sess.redirectURL) {
                            let url = sess.redirectURL
                            delete sess.redirectURL
                            res.redirect(url)
                        } else {
                            res.redirect("/homepage")
                        }
                    } else {
                        res.render("login", {
                            msg: "Wrong Password",
                            username: user.username,
                            password: "",
                        })
                    }
                })
            } else {
                res.render('login',{
                    msg: "Invalid username and password",
                    username: "",
                    password: ""
                })
            }
        })
}

// GET user/signup
module.exports.signup = (req,res) => {
    const sess = req.session;
    
    if(sess.username) {
        res.redirect("/homepage")
    } else {
        res.render("signup")
    }
}

// POST user/signup
module.exports.create = (req,res) => {
    const sess = req.session;
    const user = req.body;
    
    resolver.getUser(user.username)
        .then(result => {
            if(result === undefined) {
                res.render('signup',{
                    msg: 'Error occured. Try Again later',
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    phone: user.phone,
                    profileImageURL: user.profileImageURL,
                    latitude: user.latitude,
                    longitude: user.longitude
                })
            } else if (result) {
                res.render('signup',{
                    msg: 'Username already exists',
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    phone: user.phone,
                    profileImageURL: user.profileImageURL,
                    latitude: user.latitude,
                    longitude: user.longitude
                })
            } else {
                bcrypt.hash(user.password,saltRounds,(err,password) => {
                    if(err) {
                        res.render('signup',{
                            msg: 'Error occured. Try Again later',
                            name: user.name,
                            username: user.username,
                            email: user.email,
                            password: user.password,
                            phone: user.phone,
                            profileImageURL: user.profileImageURL,
                            latitude: user.latitude,
                            longitude: user.longitude
                        })
                    } else {
                        if(user.profileImageURL == "") {
                            user.profileImageURL = "../images/profile-user.svg"
                        }
                        resolver.addUser(user,password)
                            .then(result => {
                                if(result === undefined || !result) {
                                    res.render('signup',{
                                        msg: 'Error occured. Try Again later',
                                        name: user.name,
                                        username: user.username,
                                        password: user.password,
                                        email: user.email,
                                        phone: user.phone,
                                        profileImageURL: user.profileImageURL,
                                        latitude: user.latitude,
                                        longitude: user.longitude
                                    })
                                } else {
                                    sess.user = {
                                        username: user.username,
                                        labels: result.labels
                                    }
                    
                                    if(sess.redirectURL) {
                                        let url = sess.redirectURL
                                        delete sess.redirectURL
                                        res.redirect(url)
                                    } else {
                                        res.redirect("/homepage");
                                    }
                                }
                            })
                    }
                })
            }
        })
}

// Get user profile page
module.exports.view = (req,res) => {
    const sess = req.session;
    const username = req.params.username
    if(sess.user) {
        resolver.getUserByUsername(username)
            .then(result => {
                if(result == undefined || !result) {
                    // Display error page 404
                    res.send("404 page not found")
                } else {
                    res.render('profile',{
                        user: sess.user,
                        profile: result
                    })
                }
            })
    } else {
        sess.redirectURL = `/user/${username}`;
        res.redirect('/user/login')
    }
}