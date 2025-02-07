require('dotenv').config();
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { default: axios } = require('axios');
const { Code } = require('mongodb');
const session = require("express-session");
router.use(cookieParser());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
router.get(`/`, async (req, res) => {
    try {
        let { code, state, location } = req.query;
        console.log(code);
        console.log(state);
        console.log(location);
        const authParams = new URLSearchParams({
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code"
        });

        let accessRes = await fetch(`https://accounts.zoho.com/oauth/v2/token?${authParams}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (accessRes.ok) {
            let responseOBJ = await accessRes.json();
            if (state === "meeting") {
                console.log(req.session);
                req.session.meetingAccess = req.session.meetingAccess || {};
                req.session.meetingAccess = {
                    ...responseOBJ,
                    "expiryTime": Date.now() + 60 * 60 * 1000, // 1 hour expiry
                    "location" : location === "us" ? "com" : "in",
                };
                res.send(`<script>
                            alert('Tokens received successfully!');
                            window.location.href = '/html/meetings/upcomingMeetings.html';  
                        </script>`);
            } else if (state === "mail") {
                req.session.mailAccess = req.session.mailAccess || {};
                req.session.mailAccess = {
                    ...responseOBJ,
                    "expiryTime": Date.now() + 60 * 60 * 1000,
                    "location" : location === "us" ? "com" : "in",
                };
                req.send(`
                    <script>
                        alert('Tokens received successfully!');
                        window.location.href = '/html/mail/mail.html';  
                    </script>
                    `);
            }
        } else {
            throw new Error("Error getting access token using auth code");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get(`/refreshToken/:state`, async (req, res) => {
    try {
        let { state } = req.params; 
        let refreshToken;
        if (state === "meeting" && req.session.meetingAccess) {
            refreshToken = req.session.meetingAccess.refresh_token;
        } else if (state === "mail" && req.session.mailAccess) {
            refreshToken = req.session.mailAccess.refresh_token;
        } else {
            return res.status(400).json({ error: "No valid refresh token found." });
        }
        let refreshParams = new URLSearchParams({
            refresh_token: refreshToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "refresh_token"
        });

        let refreshResponse = await fetch(`https://accounts.zoho.com/oauth/v2/token?${refreshParams}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (refreshResponse.ok) {
            let newAccessData = await refreshResponse.json();

            if (state === "meeting") {
                req.session.meetingAccess = req.session.meetingAccess || {};
                req.session.meetingAccess = {
                    ...req.session.meetingAccess,
                    access_token: newAccessData.access_token,
                    "expiryTime": Date.now() + 60 * 60 * 1000
                };
            } else {
                req.session.mailAccess = req.session.mailAccess || {};
                req.session.mailAccess = {
                    ...req.session.mailAccess,
                    access_token: newAccessData.access_token,
                    "expiryTime": Date.now() + 60 * 60 * 1000
                };
            }

            res.json(newAccessData);
        } else {
            throw new Error("Error refreshing access token!");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/meetingAccess', async (req, res) => {
    try {
        let myres = await axios.post(`https://accounts.zoho.${loc}/oauth/v2/token`, null, {
            params: {
                refresh_token: process.env.REFRESH_TOKEN,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "refresh_token"
            }
        });
        if (myres) {
            let result = await myres.data;
            res.json(result);
        }
    } catch (error) {
        console.log(error);
    }
});

router.post(`/mailfolderAccess`, async (req, res) => {

    const sampleParam = {
        refresh_token: process.env.FOLDER_REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "refresh_token",
    }

    try {
        let myres = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
            params: sampleParam
        })

        if (myres) {
            let result = await myres.data;
            res.json(result);
        }

    } catch (error) {
        // console.log(error.message)
        // console.log(res.status);
        // res.json(error);
    }
});

router.post(`/mailmessageAccess`, async (req, res) => {
    try {
        let myres = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
            params: {
                refresh_token: process.env.MESSAGE_REFRESH_TOKEN,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "refresh_token"
            }
        });

        if (myres) {
            let result = myres.data;
            res.json(result);
        }
    } catch (error) {
        console.log(error)
        // res.json(error);
        // console.log(res.status);
    }
});
module.exports = router;