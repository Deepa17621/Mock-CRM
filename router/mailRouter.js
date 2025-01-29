require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router=express.Router();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { default: axios } = require('axios');

let MAIL_FOLDER_ACCESS;
let MAIL_MESSAGES_ACCESS;
let ACC_ID=process.env.ZOHO_MAIL_ACCOUNT_ID;
let MAIL_ACCESS_ALL;
let ACC_DETAILS;
let scope = "ZohoMail.accounts.ALL,ZohoMail.folders.ALL,ZohoMail.messages.ALL"

router.use(cookieParser());

router.use(async (req, res, next) => {  
    MAIL_FOLDER_ACCESS = await  req.cookies.mailfolder_accessToken;
    MAIL_MESSAGES_ACCESS = await req.cookies.mailmessage_accessToken;
    if(MAIL_FOLDER_ACCESS && MAIL_MESSAGES_ACCESS){
        next();
    }
    MAIL_ACCESS_ALL = req.cookies.mail_access_all;
    ACC_DETAILS = req.cookies.mail_acc_details;
    if(MAIL_ACCESS_ALL && ACC_DETAILS){
        next();
    }
    else {
               
        let result = await getTokens(req, res);
        if (result.success) {

            MAIL_FOLDER_ACCESS = await result.folderToken;
            MAIL_MESSAGES_ACCESS = await result.messageToken
            next();
        }
    }
});

let getTokens = async (req, res) => {
    console.log("Entered Into GetTokens() Generate New Access - Function");
    
    let folderReq = await axios.post(`${process.env.BASE_URI}/token/mailfolderAccess`);
    let messagesReq = await axios.post(`${process.env.BASE_URI}/token/mailmessageAccess`);    

    if (folderReq && messagesReq) {

        let folderResult = await folderReq.data;
        let messageResult = await messagesReq.data;
        
        await res.cookie("mailfolder_accessToken", folderResult.access_token, { maxAge: 3600000, secure: false, httpOnly: true });
        await res.cookie("mailmessage_accessToken", messageResult.access_token, { maxAge: 3600000, secure: false, httpOnly: true });

        return {
            "success": true,
            "folderToken": folderResult.access_token,
            "messageToken":messageResult.access_token
        }
    }
    else {
        throw new Error("Access token for Meeting Not found");
    }
}

router.get(`/getAccountDetails`, async(req,res)=>{
    try {
        let response = await fetch(`https://mail.zoho.com/api/accounts`,{
            method: "GET",
            headers: {
                "Authorization": `Zoho-oauthtoken ${MAIL_ACCESS_ALL}`,  //ZohoMail.accounts.ALL
                "Content-Type": "application/json"
            }
        });
        if(response.ok){
            let accDetails = await response.json();
            console.log("Acc-Details-Mail:===> ");
            console.log(accDetails);
            res.json(accDetails.data); // Account Id And Mail box MailAddress -FROM Address of this Account can be fetch
        }
        else {
            throw new Error("err-get-Acc-Details- "+response.statusText+", "+response.status)
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/getFoldersList', async (req, res) => {
    try {
        let response = await fetch(`https://mail.zoho.com/api/accounts/${ACC_ID}/folders`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Zoho-oauthtoken ${MAIL_FOLDER_ACCESS}`,
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

        let response=await fetch(`https://mail.zoho.com/api/accounts/${ACC_ID}/messages/view?folderId=${folderId}`, 
            {
                method:"GET",
                headers:{
                    "Accept" : "application/json",
                    "Content-Type" : "application/json",
                    "Authorization" : `Zoho-oauthtoken ${MAIL_MESSAGES_ACCESS}`
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
        let response = await fetch(`https://mail.zoho.com/api/accounts/${ACC_ID}/folders/${folderId}/messages/${messageId}/content`, {
            method:"GET",
            headers:{
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Zoho-oauthtoken ${MAIL_MESSAGES_ACCESS}`
            }
        });
        if(response.ok){
            console.log(response);
            
            let mailContent = await response.json();
            res.json(mailContent);
        }
        else{
            console.log(response);
            
            throw new Error("Error in Getting Mail content- "+ response.status+ response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
})

router.post(`/sendMail`, async(req, res)=>{
    try {
        console.log(`Zoho-oauthtoken ${MAIL_MESSAGES_ACCESS}`);
        let obj = req.body;
        let response = await fetch(`https://mail.zoho.com/api/accounts/${ACC_ID}/messages`, {
            method : "POST",
            headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Zoho-oauthtoken ${MAIL_MESSAGES_ACCESS}`
            },
            body : JSON.stringify(obj)
        });
        if(response.ok){
            let data = await response.json();
            console.log(response.ok);
            
            res.json(data);
        }
        else {
            throw new Error("Error in Send Mail: "+ response.status + " "+ response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
})

router.get(`/metaDataOfMail/:folderId/:messageId`, async(req,res)=>{
    try {
        let { folderId, messageId } = req.params;
        let result = await fetch(`https://mail.zoho.com/api/accounts/${ACC_ID}/folders/${folderId}/messages/${messageId}/details`, {
            method:"GET",
            headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Zoho-oauthtoken ${MAIL_MESSAGES_ACCESS}`
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
        console.log(error);
    }
})

module.exports=router;