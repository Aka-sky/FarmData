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


// POST user/signup
// module.exports.create = async(req,res) => {
//     const sess = req.session;
//     const user = req.body;
//     const session = driver.session();
//     // query definition
//     const query = 'MATCH (n: User{username: $username}) RETURN n.username AS username'

//     try {
//         // const result = await session.run(query,{username: user.username})

//         const result = resolver.getUser(user.username);
        
//         if(result.length > 0) {
//             throw "Username already in use!"
//         } else {
//             bcrypt.hash(user.password, saltRounds, async(err, hash) => {
//                 if (err) {
//                     throw "Server Error! Try again later."
//                 } else {
//                     let addQuery;
//                     if(user.userType == "farmer") {
//                         addQuery = "CREATE (n: User:Farmer{username: $username, email: $email, name: $name, password: $password, phone: $phone, profileImageURL: $profileImageURL, latitude: $latitude, longitude: $longitude} RETURN n.username AS username )"
//                     } else {
//                         addQuery = "CREATE (n: User:Buyer{username: $username, email: $email, name: $name, password: $password, phone: $phone, profileImageURL: $profileImageURL, latitude: $latitude, longitude: $longitude} RETURN n.username AS username )"
//                     }



//                     const addResult = await session.run(addQuery, {
//                         name: user.name,
//                         username: user.username,
//                         email: user.email,
//                         password: hash,
//                         phone: user.phone,
//                         profileImageURL: user.profileImageURL,
//                         latitude: user.latitude,
//                         longitude: user.longitude
//                     })

//                     if(result.records.length > 0) {
//                         const data = result.records[0].toObject()
//                         sess.user = {
//                             username: data.username,
//                             labels: data.labels
//                         }
//                         if(sess.redirectURL) {
//                             let url = sess.redirectURL
//                             delete sess.redirectURL
//                             res.redirect(url)
//                         } else {
//                             res.redirect("/homepage")
//                         }
//                     } else {
//                         throw "Server Error! Try again later."
//                     }
//                 }
//             })
//         }
//     } catch (error) {
//         res.render('signup',{
//             msg: error.message,
//             name: user.name,
//             username: user.username,
//             email: user.email,
//             password: user.password,
//             phone: user.phone,
//             profileImageURL: user.profileImageURL,
//             latitude: user.latitude,
//             longitude: user.longitude
//         })
//         console.log(error.message)
//     } finally {
//         await session.close()
//     }
// }