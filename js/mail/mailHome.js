async function getAuthCode(myScope) {
    try {
        window.open(`/token/getAuthCode/${myScope}`,'_self');
        
    } catch (error) {
        console.log(error);
    }
}

let btn=document.querySelector("#authCode");
btn.addEventListener("click", async(e)=>{
    e.preventDefault();
    await getAuthCode("ZohoMail.folders.ALL");
})



