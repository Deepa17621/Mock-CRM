const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const { log } = require('console');
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5500;

// Load environment variables (consider using dotenv package)
let ACCESS_TOKEN = "1000.73012cdb3c932f3f28e156247b8e2765.571caa42b823bd5d06748d5725bb912a";
const REFRESH_TOKEN = "1000.3f671416c359ae859af145b0a0c35989.0dc79244a529ff3cc57be96b31d8e4af";
const CLIENT_ID = "1000.3FMW57THDNZF3FG2GQU0UJMPBM0N8B"
const CLIENT_SECRET = "723010f112a8f95732609ce51b857dd55166431874";
const REDIRECT_URI = "https://dmock-crm.vercel.app";
const ZOHO_API_URL = 'https://meeting.zoho.in/api/v2/60017874042/sessions.json';
const TOKEN_URL = 'https://accounts.zoho.in/oauth/v2/token';
  
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
        if(response.status==401)
            {
                (async () => {
                    try {
                        const newAccessToken = await getAccessToken();
                        ACCESS_TOKEN=await newAccessToken;
                        // console.log('New access token:', newAccessToken);
                    } catch (error) {
                        console.error('Failed to get access token:', error);
                    }
                });
            }
        else if(!response.ok)
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
        return response.data.access_token; // Return the new access token
    } catch (error) {
        console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error for further handling
    }
}

// Example usage
// (async () => {
//     try {
//         const newAccessToken = await getAccessToken();
//         ACCESS_TOKEN=newAccessToken;
//         console.log('New access token:', newAccessToken);
//     } catch (error) {
//         console.error('Failed to get access token:', error);
//     }
// });
// console.log(ACCESS_TOKEN);

///===================================================


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))});