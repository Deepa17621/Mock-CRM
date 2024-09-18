const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const { log } = require('console');
const app = express();
const port = process.env.PORT || 5500;

// Load environment variables (consider using dotenv package)
const ACCESS_TOKEN = "1000.f35e0680230e93b777f7cf8777510c19.8561842731855fd9abc3bfd04f41cb28";
const REFRESH_TOKEN = "1000.3f671416c359ae859af145b0a0c35989.0dc79244a529ff3cc57be96b31d8e4af";
const CLIENT_ID = "1000.3FMW57THDNZF3FG2GQU0UJMPBM0N8B"
const CLIENT_SECRET = "723010f112a8f95732609ce51b857dd55166431874";
const REDIRECT_URI = "https://dmock-crm.vercel.app";
const ZOHO_API_URL = 'https://meeting.zoho.in/api/v2/60017874042/sessions.json';
const TOKEN_URL = 'https://accounts.zoho.in/oauth/v2/token';

  
app.use(cors());
app.use(express.json()); // For parsing application/json

// Static file serving
app.use('/accounts', express.static(path.join(__dirname, 'accounts')));
app.use('/contact', express.static(path.join(__dirname, 'contact')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/deal', express.static(path.join(__dirname, 'deal')));
app.use('/frontPage', express.static(path.join(__dirname, 'frontPage')));
app.use('/leadForm', express.static(path.join(__dirname, 'leadForm')));
app.use('/meetings', express.static(path.join(__dirname, 'meetings')));
app.use('/controller', express.static(path.join(__dirname, 'controller')));



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
                    "Authorization":"Zoho-oauthtoken "+ ACCESS_TOKEN,
                    "Content-Type": "application/json"
                }
            }
        );
        if(!response.ok) throw new Error("Error: "+ response.status+ " " + response.statusText);
        const parsedResponse=await response.json();
        res.json(parsedResponse);

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

// 4. Edit Existing Meeting Details
app.get('/editmeeting', async (req, res) => {
    try {
        const response = await fetch(
            ZOHO_API_URL,
            {
                method:"PUT",
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

//Getting Refresh Token
app.post(`/getAccessToken`,async(req,res)=>{
    try {
        let response=await fetch(TOKEN_URL,)
    } catch (error) {
        
    }
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
