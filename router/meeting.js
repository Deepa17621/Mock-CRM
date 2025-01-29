require('dotenv').config();
const express = require('express');
const cors = require(`cors`);
const session = require('express-session');
const axios = require('axios');
const { handleRedirect } = require('./authorizeGrant')

const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cors());
router.use(cookieParser());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const ZOHO_API_URL = process.env.ZOHO_API_URL;
let scopesForMeeting = `ZohoMeeting.manageOrg.READ,ZohoMeeting.meeting.ALL`;

router.use(async (req, res, next) =>{
    try {
        if(!(req.session.meetingAccess)){
            console.log("grant ");
            let url = `https://accounts.zoho.com/oauth/v2/auth?scope=${scopesForMeeting}&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}&prompt=consent&state=meeting`;
            res.send({url});
            return;
        }
        else if(!(req.session.meetingAccess.expiryTime > Date.now())){
            let refreshToken = await fetch(`/refreshToken/meeting`,{
                method: "GET"
            });
            if(refreshToken.ok){
                let accessFromRefresh = await refreshToken.json();
            }
            else{
                throw new Error("error in getting access from refresh in meeting")
            }
        }
        else{
            if(!req.session.meetingAccess.zsoid){
                console.log("get User Details");
                
                let data = await fetch(`https://meeting.zoho.${req.session.meetingAccess.location}/api/v2/user.json`, {
                    headers:{
                            "Authorization": `Zoho-oauthtoken ${req.session.meetingAccess.access_token}`
                    }
                });
                if(data.ok){
                    let result = await data.json();
                    req.session.meetingAccess.zsoid=result.userDetails.zsoid;
                    req.session.meetingAccess.zuid = result.userDetails.zuid;
                    req.session.meetingAccess.primaryMail = result.userDetails.primaryEMail;
                    console.log(result);
                    next();
                }
                else {
                    console.log("user fetch error");
                    console.log(data.status + ","+ data.message);
                    throw new Error("Fetch User Details encounterd with Error: "+ data.status+ " "+ data.statusText);
                }

            }
            else{
                next();
            }
        }
    } catch (error) {
        console.log("error in middleware");
        
        console.log(error);
    }
});

router.post('/postmeeting', async (req, res) => {
    try {
        const obj = req.body;   
        obj.presenter = req.session.meetingAccess.zuid;
        const response = await fetch(`https://meeting.zoho.${req.session.meetingAccess.location}/api/v2/${req.session.meetingAccess.zsoid}/sessions.json`,
            {
                method: "POST",
                headers: {
                    "Authorization": "Zoho-oauthtoken " + req.session.meetingAccess.access_token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            }
        );
        if (!response.ok) {throw new Error("Error: " + response.status + " " + response.statusText);}
        let postedObj = await response.json();
        res.json(postedObj);

    } catch (error) {
        console.log("error in post meeting");
        
        console.log(error);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

router.delete('/deletemeeting/:meetingKey', async (req, res) => {
    try {
        const { meetingKey } = req.params;
        const response = await fetch(
            `https://meeting.zoho.${req.session.meetingAccess.location}/api/v2/${req.session.meetingAccess.zsoid}/sessions/${meetingKey}.json`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Zoho-oauthtoken " + req.session.meetingAccess.access_token
                }
            }
        );
        let parsedData = await response.json();
        if (response.status == 204) {
            res.json(parsedData);

        }
        else if (!response.ok) throw new Error("Error: " + response.status + " " + response.statusText);
    } catch (error) {
        console.log("error in delete meeting");
        console.error('Error:', error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

router.get('/getmeetinglist', async (req, res) => {
    try {
        let response = await fetch(`https://meeting.zoho.${req.session.meetingAccess.location}/api/v2/${req.session.meetingAccess.zsoid}/sessions.json`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Zoho-oauthtoken ${req.session.meetingAccess.access_token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        if (!response.ok) {
            console.log(`https://meeting.zoho.${req.session.meetingAccess.location}/api/v2/${req.session.meetingAccess.zsoid}/sessions.json`);
            
            throw new Error("Error: " + response.status + " " + response.message)
        }
        let obj = await response.json();
        res.json(obj);

    } catch (error) {
        console.log("error in get meeting list");
        console.error('Error:', error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

router.put('/editmeeting/:meetingKey', async (req, res) => {
    try {
        let { meetingKey } = req.params;
        let session = req.body;
        const response = await fetch(
            `https://meeting.zoho.${req.session.meetingAccess.location}/api/v2/${req.session.meetingAccess.zsoid}/sessions/${meetingKey}.json`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Zoho-oauthtoken ${req.session.meetingAccess.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(session)
            }
        );
        if (!response.ok) {
            let res =await response.json()
            throw new Error(response.status+ " "+ response.statusText)
        }
        const parsedResponse = await response.json();
        res.json(parsedResponse);

    } catch (error) {
        console.log("error in edit meeting");
        console.error('Error:', error);
        res.json({ e: error });
    }
});

router.get(`/getmeeting/:meetingKey`, async (req, res) => {
    try {
        let { meetingKey } = req.params;
        const response = await fetch(
            `https://meeting.zoho.${req.session.meetingAccess.location}/api/v2/${req.session.meetingAccess.zsoid}/sessions/${meetingKey}.json`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Zoho-oauthtoken " + req.session.meetingAccess.access_token,
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
        console.log("error in get meeting");
        console.error('Error:', error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

module.exports = router;