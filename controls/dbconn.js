const mysql2 = require('mysql2')
require('dotenv').config()

const getDbInfo = {
    // host: 'localhost',
    // // port: '3306',
    // user: 'root',
    // password: '1234',
    // database: 'hdtcore'

    host: process.env.HOST,   
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}

const getConnect = function() {
     const conn = mysql2.createConnection(getDbInfo)
     conn.connect()
     return conn
}

module.exports = { 
    getDbInfo ,
    getConnect    
}