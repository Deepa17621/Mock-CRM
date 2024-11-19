require('dotenv').config();
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { default: axios } = require('axios');

const MEETING_CLIENT_ID = process.env.CLIENT_ID;
const MEETING_CLIENT_SECRET = process.env.CLIENT_SECRET;

const MAIL_CLIENT_ID = process.env.MAIL_CLIENT_ID;
const MAIL_CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET;

const REDIRECT_URI = process.env.REDIRECT_URI_LOCALHOST;


router.use(cookieParser());

router.get(`/getAuthCode/:scope`, async (req, res) => {

    console.log("Get Auth Token --");
    
    let { scope } = req.params;
    let authorizeURL =`${process.env.MAIL_AUTH_URL}?scope=${scope}&client_id=${MAIL_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}&prompt=consent`;
    res.redirect(authorizeURL);
    
});

router.get(`/callBack`, async (req, res) => {
    let { code, loc } = req.query;
    console.log("code "+ code);
    
    try {
        let res = await post.axios(`https://accounts.zoho.com/oauth/v2/token`, null, {
            params: {
                code : code,
                client_id: MAIL_CLIENT_ID,
                client_secret: MAIL_CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code"
            }
        });
        if(res){
            let data = await res.json();
            console.log(data);
            // let TokenWithExpiryTime = {
            //     "accessToken": data.access_token,
            //     "maxAge": (new Date().getTime())+data.expires_in
            // }
            // res.json(true);
        }
    } catch (error) {
        
    }
    console.log("Authorization Code:");
    console.log(code);
});

router.post('/meetingAccess', async (req, res) => {
    try {
        let myres = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
            params: {
                refresh_token: process.env.REFRESH_TOKEN,
                client_id: MEETING_CLIENT_ID,
                client_secret: MEETING_CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "refresh_token"
            }
        });
        if (myres) {
            let result = await myres.data;
            res.json(result);
        }
    } catch (error) {
        // console.log(error)
        // res.json(error);
        // console.log(res.status);
    }
});

router.post(`/mailfolderAccess`, async (req, res) => {

    const sampleParam = {
        refresh_token: process.env.FOLDER_REFRESH_TOKEN,
        client_id: MAIL_CLIENT_ID,
        client_secret: MAIL_CLIENT_SECRET,
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
                client_id: MAIL_CLIENT_ID,
                client_secret: MAIL_CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "refresh_token"
            }
        });

        if (myres) {
            let result =  myres.data;
            res.json(result);
        }
    } catch (error) {
        console.log(error)
        // res.json(error);
        // console.log(res.status);
    }
});
module.exports = router;