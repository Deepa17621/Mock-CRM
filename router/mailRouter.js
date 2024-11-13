require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router=express.Router();
const cookieParser = require('cookie-parser');
const { default: axios } = require('axios');

let MAIL_FOLDER_ACCESS;
let MAIL_MESSAGES_ACCESS;
let ACC_ID=process.env.ZOHO_MAIL_ACCOUNT_ID;

router.use(cookieParser());

router.use(async (req, res, next) => {  
    MAIL_FOLDER_ACCESS = await  req.cookies.mailfolder_accessToken;
    MAIL_MESSAGES_ACCESS = await req.cookies.mailmessage_accessToken;
    if(MAIL_FOLDER_ACCESS && MAIL_MESSAGES_ACCESS){
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
    console.log("Entered Into GetTokens() - Function");
    
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
            let mailContent = await response.json();
            res.json(mailContent);
        }
        else{
            throw new Error("Error in Getting Mail content- "+ response.status+ response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports=router;

