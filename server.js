const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5500;

// Load environment variables (consider using dotenv package)
const ACCESS_TOKEN = "Zoho-oauthtoken "+ "1000.b9519995ab62fccf2b4858bfa9d90511.298fbaa6e119d0337c35799a17943a9e";
const REFRESH_TOKEN = "1000.3f671416c359ae859af145b0a0c35989.0dc79244a529ff3cc57be96b31d8e4af";
const CLIENT_ID = "1000.3FMW57THDNZF3FG2GQU0UJMPBM0N8B"
const CLIENT_SECRET = "723010f112a8f95732609ce51b857dd55166431874";
const REDIRECT_URI = "https://dmock-crm.vercel.app";
const ZOHO_API_URL = 'https://meeting.zoho.in/api/v2/60017874042/sessions.json';
const TOKEN_URL = 'https://accounts.zoho.in/oauth/v2/token';


// console.log(ACCESS_TOKEN);
// console.log(REFRESH_TOKEN);


    
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

// 1. Proxy [--POST--] request to Zoho API
app.post('/postmeeting', async (req, res) => {
    try {
        const obj = req.body; // Get the request body
        const response = await axios.post(
            "https://meeting.zoho.in/api/v2/60017874042/sessions.json",
            obj,
            {
                headers: {
                    "Authorization":ACCESS_TOKEN ,
                    "Content-Type": "application/json"
                }
            }
        );

        // Send the response from Zoho API back to the client
        res.json(response.data);

    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// 2. [---Cancel---] Meeting Request To ZOHO Meeting API
app.post('/deletemeeting', async (req, res) => {
    try {
        const { meetingKey } = req.body; // Get the meeting key from request body
        const response = await axios.delete(
            `https://meeting.zoho.com/api/v2/60017874042/sessions/${meetingKey}.json`,
            {
                headers: {
                    "Authorization": ACCESS_TOKEN,
                    "Content-Type": "application/json"
                }
            }
        );

        // Send the response from Zoho API back to the client
        res.json(response.data);

    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// 3. Get Meeting List
app.get('/getmeetinglist', async (req, res) => {
    try {
        const response = await axios.get(
            ZOHO_API_URL,
            {
                headers: {
                    "Authorization": ACCESS_TOKEN,
                    "Content-Type": "application/json"
                }
            }
        );

        if(!response.ok)
        {
            
        }
        // Send the response from Zoho API back to the client
        res.json(response.data);

    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// Get REFRESHED Access Token Using Refresh Token
// async function getAccessFromRefreshToken() {
//     try {
//         const response = await axios.post(TOKEN_URL, {
            
//                 refresh_token: REFRESH_TOKEN,
//                 client_id: CLIENT_ID,
//                 client_secret: CLIENT_SECRET,
//                 redirect_uri: REDIRECT_URI,
//                 grant_type: 'refresh_token'
            
//         });

//         console.log('New Access Token:', response.data);
//         // You might want to store this token somewhere or update your application logic accordingly

//     } catch (error) {
//         console.error('Error refreshing access token:', error.message);
//     }
// }

// // Call the function to refresh token
// getAccessFromRefreshToken();

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
