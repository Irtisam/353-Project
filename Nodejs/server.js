'use strict';

// load package
const express = require('express');
const mysql = require('mysql');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

const PORT = 8080;
const HOST = '0.0.0.0';

//Database Connection
const connection = mysql.createConnection({
    // host: '0.0.0.0'/localhost: Used to  locally run app
    host: "localhost",
    user: "root",
    password: "password"
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

app.get('/', (req, res) => {
    res.send('server.js running');
});

// Create a new db and table
app.get('/init', (req, res) => {

    connection.query(`CREATE DATABASE IF NOT EXISTS masterdb`, function (error, result) {
        if (error) console.log(error)
    });

    // Drop the channels table if it exists
    connection.query(`USE masterdb`, function (error, results) {
        if (error) console.log(error);
    });
    const dropTableQuery = 'DROP TABLE IF EXISTS channels';
    connection.query(dropTableQuery, (error, result) => {
        if (error) throw error;
        console.log('Dropped the channels table');
    });

    //Create Table
    connection.query(`USE masterdb`, function (error, results) {
        if (error) console.log(error);
    });

    const channelsTable = `CREATE TABLE IF NOT EXISTS channels
    ( id int unsigned NOT NULL auto_increment, 
    topic varchar(100)NOT NULL,
    data varchar(1000) NOT NULL,
    PRIMARY KEY (id))`;
    connection.query(channelsTable, function (error, result) {
        if (error) console.log(error)
    });
    res.redirect('http://localhost:3000/')
    // res.send('Database and Table created!')
});

//Insert into Table
// Adds a new post to the database.
app.post('/addPost', (req, res) => {
    var topic = req.body.topic;
    var data = req.body.data;
    var query = `INSERT INTO channels (topic, data) VALUES ("${topic}", "${data}")`;
    connection.query(query, function (error, result) {
        if (error) console.log(error);
        res.send('New post inserted');
    });
});

//Get all channels
//A GET request that returns all the channels in the channels table.
app.get('/getChannels', (req, res) => {
    connection.query(`USE masterdb`, function (error, results) {
        if (error) console.log(error);
    });
    const sqlQuery = 'SELECT * FROM channels';
    connection.query(sqlQuery, function (error, result) {
        if (error) console.log(error);
        res.json(result);
    });
});

app.listen(PORT, HOST);

console.log('up and running');