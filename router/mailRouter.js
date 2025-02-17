require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router=express.Router();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { default: axios, all } = require('axios');

let scope = "ZohoMail.accounts.ALL,ZohoMail.folders.ALL,ZohoMail.messages.ALL"

router.use(cookieParser());
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

router.use(async (req, res, next) => {  
    try {
            if(!(req.session.mailAccess)){
                console.log("grant ");
                let url = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}&prompt=consent&state=mail`;
                res.send({url});
                return;
            }
            else if(!(req.session.mailAccess.expiryTime > Date.now())){
                console.log("refresh-token");
                let refreshToken = await fetch(`/refreshToken/mail`,{
                    method: "GET"
                });
                if(refreshToken.ok){
                    let accessFromRefresh = await refreshToken.json();
                    req.session.mailAccess.refreshToken= accessFromRefresh.data.refresh_token;
                }
                else{
                    throw new Error("error in getting access from refresh in mail")
                }
            }
            else{
                if(!req.session.mailAccess.currentAccDetails){
                    let mailAccountRes = await fetch(`https://mail.zoho.${req.session.mailAccess.location}/api/accounts`,{
                        method: "GET",
                        headers: {
                            "Authorization": `Zoho-oauthtoken ${req.session.mailAccess.access_token}`,  //ZohoMail.accounts.ALL
                            "Content-Type": "application/json"
                        }
                    });
                    if(mailAccountRes.ok){
                        let allAccountResult = await mailAccountRes.json();
                        req.session.mailAccess.allAccounts = allAccountResult.data;
                        try {
                            let specificAccRes = await fetch(`https://mail.zoho.${req.session.mailAccess.location}/api/accounts/${allAccountResult.data[0].accountId}`, {
                                method: "GET",
                                headers: {
                                    "Authorization" : `Zoho-oauthtoken ${req.session.mailAccess.access_token}`,
                                    "Content-Type": "application/json",
                                }
                            });
                            if(specificAccRes.ok){
                                let specificAcc = await specificAccRes.json();
                                req.session.mailAccess.currentAccDetails = specificAcc.data;
                                next();
                            }
                            else {
                                console.log(specificAccRes.status + ", "+ specificAccRes.message);
                                throw new Error("Error in getting Account Detail: "+ specificAccRes.status+ ", "+ specificAccRes.message);
                            }
                        } catch (error) {
                            res.send(error);
                        }
                    }
                    else {
                        throw new Error("Error in getting All : "+ mailAccountRes.status+ " "+ mailAccountRes.statusText);
                    }
                }
                else{
                    next();
                }
            }
        } catch (error) {
           console.log(error);
           res.send("Error in Middle Ware"+error);
        }
});

router.get('/getFoldersList', async (req, res) => {
    try {
        let response = await fetch(`https://mail.zoho.com/api/accounts/${req.session.mailAccess.currentAccDetails.accountId}/folders`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Zoho-oauthtoken ${req.session.mailAccess.access_token}`,
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

router.get(`/getListOfEmails/:folderId`, async(req, res)=>{
    try {
        const { folderId } = req.params;
        let response=await fetch(`https://mail.zoho.com/api/accounts/${req.session.mailAccess.currentAccDetails.accountId}/messages/view?folderId=${folderId}`, 
            {
                method:"GET",
                headers:{
                    "Accept" : "application/json",
                    "Content-Type" : "application/json",
                    "Authorization" : `Zoho-oauthtoken ${req.session.mailAccess.access_token}`
                }
            }
        )
        if(!response.ok){
         throw new Error(response.status+ " Mail-Messages-Access-Token-Error "+ response.statusText);       
        }
        let obj=await response.json();
        res.json(obj);
    } catch (error) {
        console.log(error);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
})

router.get(`/displayMail/:folderId/:messageId`, async(req, res)=>{
    try {
        const {folderId, messageId } = req.params;
        let response = await fetch(`https://mail.zoho.com/api/accounts/${req.session.mailAccess.currentAccDetails.accountId}/folders/${folderId}/messages/${messageId}/content`, {
            method:"GET",
            headers:{
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Zoho-oauthtoken ${req.session.mailAccess.access_token}`
            }
        });
        if(response.ok){
            let mailContent = await response.json();
            res.json(mailContent);
        }
        else{
            throw new Error("Error in Getting Mail content- "+ response.status+ response.statusText);
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.post(`/sendMail`, async(req, res)=>{
    try {
        let obj = req.body;
        let response = await fetch(`https://mail.zoho.com/api/accounts/${req.session.mailAccess.currentAccDetails.accountId}/messages`, {
            method : "POST",
            headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Zoho-oauthtoken ${req.session.mailAccess.access_token}`
            },
            body : JSON.stringify(obj)
        });
        if(response.ok){
            let data = await response.json();
            res.json(data);
        }
        else {
            throw new Error("Error in Send Mail: "+ response.status + " "+ response.statusText);
        }
    } catch (error) {
        res.send(error);
    }
})

router.get(`/metaDataOfMail/:folderId/:messageId`, async(req,res)=>{
    try {
        let { folderId, messageId } = req.params;
        let result = await fetch(`https://mail.zoho.com/api/accounts/${req.session.mailAccess.currentAccDetails.accountId}/folders/${folderId}/messages/${messageId}/details`, {
            method:"GET",
            headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Zoho-oauthtoken ${req.session.mailAccess.access_token}`
            },
        })
        if(result.ok){
            let data = await result.json();
            res.json(data);
        }
        else{
            throw new Error(result.status+" err in get MetaData "+ result.statusText);
        }
    } catch (error) {
        res.send(error);
    }
})

module.exports=router;