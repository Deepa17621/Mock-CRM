const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5500;

// Define authorization code as a variable
// let AUTHORIZATION_CODE = "Zoho-oauthtoken 1000.d89a54923c954d482720ca3c8258b4b7.5bd6a03faa7dbf0b81be6107ce943f69";

// Middleware
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

//1. Proxy [--POST--] request to Zoho API
// app.post('/postmeeting', async (req, res) => {
//     try {
//         const obj = req.body; // Get the request body
//         console.log(obj);
        
//         const response = await fetch(
//             'https://meeting.zoho.in/api/v2/60017874042/sessions.json',
//              // Pass the body to the Zoho API
//             {
//                 method:"POST",
//                 headers: {
//                     "Authorization": AUTHORIZATION_CODE,
//                     "Content-Type": "application/json"
//                 },
//                 body:JSON.stringify(obj)
//             }
//         );

//         // Send the response from Zoho API back to the client
//         console.log(await response.json());
        
//     } catch (error) {
//         console.error('Error:', error.message); // Log the error
//         // Respond with an appropriate error message and status code
//         res.status(error.response?.status || 500).json({ error: error.message });
//     }
// });

// // 2. [---Cance---l] Meetig Request To ZOHO Meeting API
// app.post('/deletemeeting', async (req, res) => {
//     try { 
//         const response = await fetch('https://meeting.zoho.com/api/v2/60017874042/sessions/{meetingKey}.json',
//              // Pass the body to the Zoho API
//             {
//                 method:"DELETE",
//                 headers: {
//                     "Authorization":"Zoho-oauthtoken 1000.4466c9b6dbb51d843ccb17cace20f042.6eb6a617265b322520364bb6289c4eb4",
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         // Send the response from Zoho API back to the client
//         console.log(await response.json());
        
//     } catch (error) {
//         console.error('Error:', error.message); // Log the error
//         // Respond with an appropriate error message and status code
//         res.status(error.response?.status || 500).json({ error: error.message });
//     }
// });


// 2. Get MeetingList // WORK IN PROGRESS
app.get('/getmeetinglist', async (req, res) => {
    try { 
        const response = await fetch('https://meeting.zoho.in/api/v2/60017874042/sessions.json',
             // Pass the body to the Zoho API
            {
                method:"GET",
                headers: {
                    "Authorization": "Zoho-oauthtoken 1000.e7eed0bee82107399caf0a2ac971dd39.a84f8185253ecde743ca34b4f5f38205",
                    "Content-Type": "application/json"
                }
            }
        );

        // Send the response from Zoho API back to the client
        let result = await response.json();
        console.log(result);
        
       res.json(result);
        
    } catch (error) {
        console.error('Error:', error.message); // Log the error
        // Respond with an appropriate error message and status code
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});


// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// Get REFRESHED Access Token Using Refresh Token

// async function getAccessFromRefreshToken(refresh_token)
// {
//     try {
        
//         let response=await fetch(`https://accounts.zoho.in/oauth/v2/token?
//             refresh_token=${refresh_token}&client_id=1000.3FMW57THDNZF3FG2GQU0UJMPBM0N8B&client_secret=723010f112a8f95732609ce51b857dd55166431874&
//             redirect_uri=https://dmock-crm.vercel.app&
//             grant_type=refresh_token`)
//     }
    
//     catch (error) {
        
//     }
// }