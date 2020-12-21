const express = require('express');
const driver = require('../config/db');

module.exports.getAllSellers = async(username, range) => {

    const session = driver.session();

    const query = `MATCH (seller: Farmer), (user: Buyer{username: $username}) WHERE distance(point({longitude: toFloat(seller.longitude), latitude: toFloat(seller.latitude)}), point({longitude: toFloat(user.longitude), latitude: toFloat(user.latitude)}))/1000 <= ${range} RETURN seller.name AS name,seller.username AS username, seller.latitude AS latitude, seller.longitude AS longitude`;

    try {
        const result = await session.run(query, {
            username
        })

        if(result.records.length > 0) {
            const sellers = [];
            result.records.forEach(record => {
                sellers.push(record.toObject())
            })

            return sellers;
        } else {
            return [];
        }

    } catch (error) {
        console.log(error.message);
        return undefined;
    } finally {
        await session.close();
    }
}
