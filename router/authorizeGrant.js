function handleRedirect(req,res, clientID, redirectURI,scopes ){
    res.redirect(`https://accounts.zoho.com/oauth/v2/auth?scope=${scopes}&client_id=${clientID}&response_type=code&access_type=offline&redirect_uri=${redirectURI}&prompt=consent`);
}

module.exports = { handleRedirect };