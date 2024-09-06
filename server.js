const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5500;

// Define authorization code as a variable
const AUTHORIZATION_CODE = "Zoho-oauthtoken 1000.ffffdcacc93c99e7274d20bb905ed42c.13369c0f9aeb49f00f933f6158d6b90f";

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

// Proxy POST request to Zoho API
app.post('/postmeeting', async (req, res) => {
    try {
        const obj = req.body; // Get the request body
        console.log(obj);
        
        const response = await fetch(
            'https://meeting.zoho.in/api/v2/60017874042/sessions.json',
             // Pass the body to the Zoho API
            {
                method:"POST",
                headers: {
                    "Authorization": AUTHORIZATION_CODE,
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(obj)
            }
        );

        // Send the response from Zoho API back to the client
        console.log(await response.json());
        
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
