require('dotenv').config();
const express = require('express');

const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());
const axios = require('axios');

let ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const ZOHO_API_URL = process.env.ZOHO_API_URL;
const TOKEN_URL = process.env.TOKEN_URL;


router.use(async (req, res, next) => {
    let meeting_access = res.cookie.meeting_access;
    if (meeting_access) {
        ACCESS_TOKEN = meeting_access;
        next();
    }
    else {
        let result = await getToken(req, res);
        if (result.success) {
            ACCESS_TOKEN = await result.token;
            next();
        }
    }
});

let getToken = async (req, res) => {
    console.log(res);

    let myreq = await axios.post(`/token/meetingAccess`);
    if (myreq) {
        let result = await myreq.data;
        console.log(result);

        await res.cookie("meeting_accessToken", result.access_token, { maxAge: 3600000, secure: false, httpOnly: true });
        return {
            "success": true,
            "token": result.access_token
        }
    }
    else {
        throw new Error("Access token for Meeting Not found");
    }
}

// 1. [--POST--] request to Zoho API
router.post('/postmeeting', async (req, res) => {
    try {
        const obj = req.body; // Get the request body
        const response = await fetch(
            ZOHO_API_URL,
            {
                method: "POST",
                headers: {
                    "Authorization": "Zoho-oauthtoken " + ACCESS_TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            }
        );
        if (!response.ok) throw new Error("Error: " + response.status + " " + response.statusText);
        let postedObj = await response.json();
        res.json(postedObj);

    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// 2. [---Cancel---] Meeting Request To ZOHO Meeting API
router.delete('/deletemeeting/:meetingKey', async (req, res) => {
    try {
        const { meetingKey } = req.params; // Get the meeting key from request body
        const response = await fetch(
            `https://meeting.zoho.in/api/v2/60017874042/sessions/${meetingKey}.json`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Zoho-oauthtoken " + ACCESS_TOKEN
                }
            }
        );
        let parsedData = await response.json();
        if (response.status == 204) {
            res.json(parsedData);

        }
        else if (!response.ok) throw new Error("Error: " + response.status + " " + response.statusText);
    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// 3. Get Meeting List
router.get('/getmeetinglist', async (req, res) => {
    try {
        let response = await fetch("https://meeting.zoho.in/api/v2/60017874042/sessions.json",
            {
                method: "GET",
                headers: {
                    "Authorization": `Zoho-oauthtoken ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        if (!response.ok) {
            throw new Error("Error: " + response.status + " " + response.message)
        }
        let obj = await response.json();
        res.json(obj);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// 4. Edit Existing Meeting Details
router.put('/editmeeting/:meetingKey', async (req, res) => {
    let { meetingKey } = req.params;
    try {
        let session = req.body;
        const response = await fetch(
            `https://meeting.zoho.in/api/v2/60017874042/sessions/${meetingKey}.json`,
            {
                method: "PUT",
                headers: {
                    "Authorization": "Zoho-oauthtoken " + ACCESS_TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(session)
            }
        );
        if (!response.ok) {
            throw new Error("Error: " + response.status + " " + response.message)
        }
        const parsedResponse = await response.json();
        res.json(parsedResponse);

    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// 5. Get Meeting By MeetingKey
router.get(`/getmeeting/:meetingKey`, async (req, res) => {
    try {
        let { meetingKey } = req.params;
        const response = await fetch(
            `https://meeting.zoho.in/api/v2/60017874042/sessions/${meetingKey}.json`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Zoho-oauthtoken " + ACCESS_TOKEN,
                    "Content-Type": "application/json"
                }
            }
        );
        if (!response.ok) {
            throw new Error("Error: " + response.status + " " + response.message)
        }
        const parsedResponse = await response.json();
        res.json(parsedResponse);
    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

module.exports = router;