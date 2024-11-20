function handleRedirect(req,res, clientID, redirectURI,scopes ){
    res.redirect(`https://accounts.zoho.com/oauth/v2/auth?scope=${scopes}&client_id=${clientID}&response_type=code&access_type=offline&redirect_uri=${redirectURI}&prompt=consent`);
}

async function myFunction(){
    let meeting_access = req.cookies.meeting_access;
    let user_details = req.cookies.meeting_user_details;
    if (meeting_access) {
        let userData = await fetch(`/getZohoMeetingUserDetails/${meeting_access}`);
        if(userData.ok){
            let obj = await userData.json();
            if(user_details.zsoid === obj.userDetails.zsoid){
                ACCESS_TOKEN = meeting_access;
                ZSOID = obj.userDetails.zsoid;
                next();
            }
        }
        else {
            res.redirect(`https://accounts.zoho.com/oauth/v2/auth?scope=${scopesForMeeting}&client_id=${MAIL_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}&prompt=consent`);
        }
    }
    else {
        // "zoho_meeting-integra": "^1.0.0"
    
        // "api-auth-zoho": "^1.0.15",
       return handleRedirect(req, res, MAIL_CLIENT_ID, REDIRECT_URI,scopesForMeeting);
        // res.redirect(`https://accounts.zoho.com/oauth/v2/auth?scope=${scopesForMeeting}&client_id=${MAIL_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}&prompt=consent`);
        // // console.log("Entered into Meeting MiddleWare");
        // // let authCodeReq = await fetch(`${process.env.BASE_URI}/token/getAuthCode/${scopesForMeeting}`);
        // // console.log("AuthCodeRequest:");
        // // console.log(authCodeReq);  
        // // res.redirect(authCodeReq.url);
    }
}
module.exports = { handleRedirect };