const express = require('express');

const saltRounds = 10 
const bcrypt = require('bcrypt')
const driver = require('../config/db');

module.exports.getUser = async(username) => {
    const session = driver.session();
    
    // query definition
    const query = 'MATCH (n: User{username: $username}) RETURN n.username As username, n.password AS password, n.email AS email, n.phone AS phone, n.profileImageURL AS profileImageURL, n.latitude As latitude, n.longitude AS longitude, labels(n) AS labels'

    try {
        const result = await session.run(query,{
            username: username
        })

    if(result.records.length > 0) {
        // console.log(result.records[0].toObject())
        return result.records[0].toObject();
    } else {
        return 0;
    }        
    } catch (error) {
        console.log(error.message)
        return undefined
    } finally {
        await session.close();
    }
}

module.exports.addUser = async(user,password) => {
    const session = driver.session();
    let query;
    if(user.userType == "farmer") {
        query = "CREATE (n: User:Farmer{username: $username, email: $email, name: $name, password: $password, phone: $phone, profileImageURL: $profileImageURL, latitude: $latitude, longitude: $longitude}) RETURN n.username AS username, labels(n) AS labels"
    } else {
        query = "CREATE (n: User:Buyer{username: $username, email: $email, name: $name, password: $password, phone: $phone, profileImageURL: $profileImageURL, latitude: $latitude, longitude: $longitude}) RETURN n.username AS username, labels(n) AS labels"
    }
    
    try {
        const result = await session.run(query,{
            name: user.name,
            username: user.username,
            email: user.email,
            password: password,
            phone: user.phone,
            profileImageURL: user.profileImageURL,
            latitude: user.latitude,
            longitude: user.longitude
        })

        if(result.records.length > 0) {
            return result.records[0].toObject();
        } else {
            return false;
        }
    } catch (error) {
        console.log(error.message)
        return undefined;
    } finally {
        await session.close();
    }
}

module.exports.getUserByUsername = async(username) => {

    const session = driver.session();

    const query = 'MATCH (user:User{username: $username}) RETURN user.name AS name, user.username AS username, user.phone AS phone, user.email AS email, user.latitude AS latitude, user.longitude AS longitude, user.profileImageURL AS profileImageURL'
    try {
        
        const result = await session.run(query,{
            username
        }) 

        if(result.records[0].length > 0) {
            return result.records[0].toObject();
        }

        return 0;

    } catch (error) {
        console.log(error.message)
        return undefined
    } finally {
        await session.close();
    }

}
