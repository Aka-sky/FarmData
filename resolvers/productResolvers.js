const express = require('express');
// const saltRounds = 10 
// const bcrypt = require('bcrypt')
const driver = require('../config/db');

module.exports.addProduct = async(user, product) => {

    const session = driver.session();

    const query = 'MATCH (farmer: Farmer{username: $username}) CREATE (product: Product {name: $name, description: $description, condition: $condition, category: $category, unit: $unit, price: $price, productImageURL: $productImageURL}) <- [:ADDED {created_at: DATETIME()}] - (farmer) RETURN product.name AS product, farmer.username AS farmer';

    try {
        const result = await session.run(query, {
            username: user.username,
            category: product.category,
            name: product.name,
            description: product.description,
            condition: product.condition,
            unit: product.unit,
            price: product.price,
            productImageURL: product.productImageURL
        })

        if(result.records.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error.message);
        return undefined; 
    } finally {
        await session.close();
    }
}

module.exports.getAllProducts = async() => {
    const session = driver.session();

    const query = 'MATCH (product: Product) RETURN ID(product) AS product_id, product.name AS name, product.category AS category, product.price AS price, product.productImageURL AS productImageURL'
    try {
        const result = await session.run(query);

        const products = [];
        result.records.forEach(record => products.push(record.toObject()));

        return products;
    } catch (error) {
        return undefined;
    } finally {
        await session.close();
    }
}

module.exports.getProductById = async(product_id) => {
    const session = driver.session();

    // console.log(product_id)

    const query = `MATCH (product: Product) WHERE ID(product) = ${product_id} RETURN product.name AS name, product.category AS category, product.description AS description, product.productImageURL AS productImageURL, product.price AS price, product.condition AS condition, product.unit AS unit`

    try {
        
        const result = await session.run(query)
        // console.log(result.records)
        if(result.records.length > 0) {
            return result.records[0].toObject();
        } else {
            return 0;
        }

    } catch (error) {
        // console.log(error.message)
        return undefined;
    } finally {
        await session.close();
    }
}

module.exports.getSeller = async(product_id) => {
    const session = driver.session();

    const query = `MATCH (n: Product)-[:ADDED]-(farmer:Farmer) WHERE ID(n) = ${product_id} RETURN farmer.name AS name, farmer.username AS username, farmer.email AS email, farmer.phone AS phone, farmer.latitude AS latitude, farmer.longitude AS longitude`;

    try {
        const result = await session.run(query)

        if(result.records.length > 0) {
            return result.records[0].toObject();
        } else {
            return 0;
        }

    } catch (error) {
        return undefined;
    } finally {
        await session.close();
    }
}