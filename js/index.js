// let url=window.location.search;
// let param=new URLSearchParams(url);
// let code=param.get("code");
// let loc = param.get("location");

// const { get } = require("lodash");

// // console.log(code);

// async function getAuthCode(code, loc) {
//     if(loc == 'us'){
//         loc = 'com'
//     }
//     else if( loc == 'in'){
//         loc = 'in'
//     }
//     console.log("Deepa");
    
//     let res=await fetch(`/token/callback/${code}/${loc}`);
//     if(res.ok){
//         console.log(code);
//         res.json(code )
//     }
// }

// getAuthCode(code, loc)

let leads = document.querySelector("#leads");
let contacts = document.querySelector("#contacts");
let accounts = document.querySelector("#accounts");
let deals = document.querySelector("#deals");

let countContainer = document.querySelectorAll(".count");
countContainer.forEach(element => {
    element.addEventListener("click", (e)=>{
        e.preventDefault();
        if(element.id === "leads"){
            window.location.href = `/html/leads/leadList.html`;
        }
        else if(element.id === "contacts"){
            window.location.href = `/html/contacts/contactList.html`;
        }
        else if(element.id === "accounts"){
            window.location.href = `/html/accounts/accountList.html`;
        }
        else if(element.id === "deals"){
            window.location.href = `/html/deals/dealList.html`;
        }
    });
});

let leadCount = document.querySelector(".lead-count");
let contactCount = document.querySelector(".contact-count");
let accountCount = document.querySelector(".account-count");
let dealCount = document.querySelector(".deal-count");

async function setCount() {
    leadCount.textContent = await getAll("leads");
    contactCount.textContent = await getAll("contacts");
    accountCount.textContent = await getAll("accounts");
    dealCount.textContent = await getAll("deals");
}
setCount();

async function getAll(module) {
    try {
        let res = await fetch(`/mongodb/getAll/${module}`, {
            method:"GET",
            headers:{"Content-Type": "application/json"}
        });
        if(res.ok){
            let data = await res.json();
            return data.length;
        }
        else{
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}

