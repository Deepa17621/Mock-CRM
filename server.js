require('dotenv').config();
const express = require('express');
const path = require('path');
// MONGODB
const {MongoClient, ObjectId}=require('mongodb');

const cors = require('cors');
const axios = require('axios');
const { log, error } = require('console');
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5500;

// Load environment variables (consider using dotenv package)
let ACCESS_TOKEN="1000.9310db558aad1e0c6f44c1877990faf1.970d969aede8ae64521af8c7aa6305ee";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const ZOHO_API_URL = process.env.ZOHO_API_URL;
const TOKEN_URL =process.env.TOKEN_URL;
  
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


// Access Token Validation
// app.get("/", async(req,res)=> {
//     ACCESS_TOKEN=req.cookies.newAccessToken;
//     if(!ACCESS_TOKEN)
//     {
//         let outPut=await getAccessToken();
//         if(outPut.status)
//         {
//             ACCESS_TOKEN=await outPut.accessToken;
//             // next();
//         }
//         else
//         {
//             return res.status(401).json({ error: 'Unauthorized: Token not available', ACCESS_TOKEN });
//         }
//     }
//     else {
//         // next()
//     }
// });

// 1. [--POST--] request to Zoho API
app.post('/postmeeting', async (req, res) => {
    try {
        const obj = req.body; // Get the request body
        const response = await fetch(
            ZOHO_API_URL,
            {
                method:"POST",
                headers: {
                    "Authorization":"Zoho-oauthtoken "+ACCESS_TOKEN ,
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(obj)
            }
        );
        if(!response.ok) throw new Error("Error: "+response.status + " " +response.statusText);
        let postedObj=await response.json();
        res.json(postedObj);

    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// 2. [---Cancel---] Meeting Request To ZOHO Meeting API
app.delete('/deletemeeting/:meetingKey', async (req, res) => {
    try {
        const { meetingKey } = req.params; // Get the meeting key from request body
        const response = await fetch(
            `https://meeting.zoho.in/api/v2/60017874042/sessions/${meetingKey}.json`,
            {
                method:"DELETE",
                headers: {
                    "Authorization":"Zoho-oauthtoken "+ ACCESS_TOKEN
                }
            }
        );
        let parsedData=await response.json();
        if(response.status==204)
        {
            res.json(parsedData);

        }
        else if(!response.ok) throw new Error("Error: "+ response.status+ " " + response.statusText);
    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// 3. Get Meeting List
app.get('/getmeetinglist', async (req, res) => {
    try {
        let response = await fetch("https://meeting.zoho.in/api/v2/60017874042/sessions.json",
            {
                method:"GET",
                headers: {
                    "Authorization":`Zoho-oauthtoken ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        if(!response.ok)
        {
            throw new Error("Error: "+response.status+ " "+ response.message)
        }
        let obj=await response.json();
        res.json(obj);

    } catch (error) {
        console.error('Error:', error.message); 
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

let paramss=new URLSearchParams({refresh_token:  REFRESH_TOKEN,
    client_id:CLIENT_ID,
    client_secret:CLIENT_SECRET,
    redirect_uri:REDIRECT_URI,
    grant_type:"refresh_token"
});
console.log(paramss);

// 4. Edit Existing Meeting Details
app.put('/editmeeting/:meetingKey', async (req, res) => {
    let {meetingKey}=req.params;
    try {
        let session=req.body;
        const response = await fetch(
            `https://meeting.zoho.in/api/v2/60017874042/sessions/${meetingKey}.json`,
            {
                method:"PUT",
                headers: {
                    "Authorization":"Zoho-oauthtoken "+ ACCESS_TOKEN,
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(session)
            }
        );
        if(!response.ok)
        {
            throw new Error("Error: "+response.status+ " "+ response.message)
        }
        const parsedResponse=await response.json();
        res.json(parsedResponse);

        } catch (error) {
            console.error('Error:', error.message); // Log the error
            res.status(error.response?.status || 500).json({ error: error.message });
        }
});

// 5. Get Meeting By MeetingKey
app.get(`/getmeeting/:meetingKey`, async (req, res) => {
    try {
        let {meetingKey}=req.params;
        const response = await fetch(
            `https://meeting.zoho.in/api/v2/60017874042/sessions/${meetingKey}.json`,
            {
                method:"GET",
                headers: {
                    "Authorization":"Zoho-oauthtoken "+ ACCESS_TOKEN,
                    "Content-Type": "application/json"
                }
            }
        );
        if(!response.ok)
        {
            throw new Error("Error: "+response.status+ " "+ response.message)
        }
        const parsedResponse=await response.json();
        res.json(parsedResponse);        
    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});


// //Getting Refresh Token
async function getAccessToken() {
    try {
        const response = await axios.post(TOKEN_URL,paramss);
        res.cookie("newAccessToken",response.data.access_token, {
            httpOnly: true,  // Can't be accessed via JavaScript
            secure: false,   // Set to true if using HTTPS
            sameSite: 'Strict', // Helps prevent CSRF
            maxAge: 3600000  // Cookie expires in 1 hour
        });
        return {
            "status":true,
            "accessToken":response.data.access_token
        }; // Return the new access token
    } catch (error) {
        console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error for further handling
    }
}


// Example usage
// (async () => {
//     try {
//         const newAccessToken = await getAccessToken();
//         console.log('New access token:', newAccessToken);
//     } catch (error) {
//         console.error('Failed to get access token:', error);
//     }
// });
// console.log(ACCESS_TOKEN);

///===================================================

// For Database Connection
const router=express.Router();
const MONGODB_URI=process.env.MONGODB_URI;

// Connect mongoDB with application using mongoDB URI 
let client=new MongoClient(MONGODB_URI);
const database=client.db('dmockcrm'); //get specific database from cluster

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected with MongoDB Atlas");
        
    } catch (error) {
        console.error("Error Connecting with MongoDB: "+ error);
    }
}

connectToMongoDB(); // functionCall to make connection with mongoDB
// Post
app.post('/post/:module', async (req, res) => {
    try {
        const { module }=req.params;
        const obj = req.body;
        const result = await database.collection(module).insertOne(obj);
        res.send(obj);
        // res.status(201).send({ id: result.insertedId, message: `Successfully inserted!` });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: 'Error creating ' });
    }
});
//Get By Id
app.get('/getById/:module/:id', async(req, res)=>{
    try {
        const { module , id}=req.params;
        const result=await database.collection(module).findOne({_id: new ObjectId(`${id}`)});
        if(!result){
            return res.status(404).send({message: `${module} not Found!`});
        }
        res.json(result);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).send({ message: 'Error fetching user by ID' });
    }
});

//Get All
app.get('/getAll/:module', async(req,res)=>{
    try {
        const { module }=req.params;
        const listOfUsers = await database.collection(module).find({}).toArray();
        res.json(listOfUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: 'Error fetching users' });
    }
});


// Update
app.put('/update/:module/:id', async (req, res) => {
    try {
        const {module, id} = req.params;
        const updateUser = req.body;
        let updatedData=await database.collection(module).updateOne({ _id: new ObjectId(id) }, { $set: updateUser });
        res.send(updatedData);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: 'Error updating user' });
    }
});
// Delete
app.delete('/delete/:module/:id', async (req, res) => {
    try {
        const { module , id}=req.params;
        let deleted=await database.collection(module).deleteOne({ _id:new ObjectId(id) });
        res.send(deleted)
        // res.send({ message: `User Deleted!` });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: 'Error deleting user' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))});