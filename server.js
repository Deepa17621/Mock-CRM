require('dotenv').config();
const express = require('express');
const path = require('path');

const {MongoClient, ObjectId}=require('mongodb');

const cors = require('cors');
const axios = require('axios');
// const { log, error } = require('console');
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5500;
  
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(cookieParser());

// Static file serving
app.use('/accounts', express.static(path.join(__dirname, 'accounts')));
app.use('/contact', express.static(path.join(__dirname, 'contact')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/deal', express.static(path.join(__dirname, 'deal')));
app.use('/frontPage', express.static(path.join(__dirname, 'frontPage')));
app.use('/leadForm', express.static(path.join(__dirname, 'leadForm')));
app.use('/meetings', express.static(path.join(__dirname, 'meetings')));
app.use('/controller', express.static(path.join(__dirname, 'controller')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/meetingImages', express.static(path.join(__dirname, 'meetingImages')));
app.use('/mail', express.static(path.join(__dirname, 'mail')));
app.use('/router', express.static(path.join(__dirname, 'router')));

let mail_Router = require("./router/mailRouter");
let meeting_Router = require("./router/meeting");
let mongoDB_Router = require("./router/mongodb");
let token_Router = require("./router/token");


app.use("/mail", mail_Router);
app.use("/token", token_Router);
app.use("/mongodb", mongoDB_Router);
app.use("/meeting", meeting_Router);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))});