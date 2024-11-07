require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router=express.Router();
const cookieParser = require('cookie-parser');

let accessToken_folders;
let accessToken_messages;
let account_Id=process.env.ZOHO_MAIL_ACCOUNT_ID;

router.use(cors());
router.use(express.json()); // To parse raw data
router.use(cookieParser());

router.use(async (req, res, next)=>{
    let access_folders=req.cookies.accessToken_folders;
    let access_messages=req.cookies.accessToken_messages;
    if(!access_folders  || !access_messages){
        // let tokenResult=await getToken(req, res);
        // accessToken_folders=await tokenResult.foldersToken;
        // accessToken_messages=await tokenResult.messagesToken;
        // next();
    }
    // next();
});


// let getToken=async (req, res)=>{
//     try {
//         let 
//     } catch (error) {
        
//     }
// }
module.exports=router;


