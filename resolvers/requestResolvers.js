const express = require('express');
// const saltRounds = 10 
// const bcrypt = require('bcrypt')
const driver = require('../config/db');

module.exports.makeRequest = async(quantity, product_id, username) => {
    
    const session = driver.session();
    
    const query = `MATCH (prod: Product), (user: Buyer) WHERE ID(prod) = ${product_id} AND user.username = $username CREATE (user)-[requested :REQUESTED {quantity: $quantity, expected_date: "Not Decided", status: "Pending", reason: "Pending",created_at: DATETIME()}]->(prod) RETURN requested;`

    try {
        const result = await session.run(query, {
            quantity,
            username
        })

        if(result.records.length > 0) {
            return result.records[0].toObject()
        } else {
            return undefined
        }
    } catch (error) {
        console.log(error.message);
        return undefined;
    } finally {
        await session.close();
    }
}

module.exports.getAllRequestsReceived = async(username) => {
    const session =  driver.session();

    const query = 'MATCH (farmer: Farmer {username: $username})-[added:ADDED]-(prod: Products)-[requests:REQUESTED]-(buyer:Buyer) RETURN requests '

    try {
        


    } catch (error) {
        console.log(error.message)
        return undefined
    } finally {
        await session.close();
    }
}