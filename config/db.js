const neo4j = require('neo4j-driver')

const driver = neo4j.driver(`${process.env.NEO4J_PROTOCOL}://${process.env.NEO4J_HOST}`, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD))

/*
NEO4J_PROTOCOL=bolt
NEO4J_HOST=localhost
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=12345678
NEO4J_PORT=7687
*/

module.exports = driver