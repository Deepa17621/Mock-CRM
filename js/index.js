// let url=window.location.search;
// let param=new URLSearchParams(url);
// let code=param.get("code");
// let loc = param.get("location");

// const { random } = require("lodash");

// const { get } = require("lodash");

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
    let leadData = await getAll("leads");
    leadCount.textContent = await leadData.length;
    let contactData = await getAll("contacts");
    contactCount.textContent = await contactData.length;
    let accountData = await getAll("accounts");
    accountCount.textContent = await accountData.length;
    let dealData = await getAll("deals");
    dealCount.textContent = await dealData.length;
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
            return data;
        }
        else{
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}

// year division-quarter performance
let leadRow = document.querySelector(".lead-quarter-performance");
let contactRow = document.querySelector(".contact-quarter-performance");
let accountRow = document.querySelector(".account-quarter-performance");
let dealRow = document.querySelector(".deal-quarter-performance");
let dealWonRow = document.querySelector(".dealWon-quarter-performance");
let revenueRow = document.querySelector(".revenue-quarter-performance");

async function setQuarterYearPerformance() {
    let currentDate = new Date();
    let columnTitle = document.querySelectorAll(".col-title");
    let q = 0;
    console.log(columnTitle);
    
    columnTitle.forEach(element => {
        if((Array.from(columnTitle).indexOf(element)) !== 0 ){
            element.textContent = `FY ${currentDate.getFullYear()} - Q${++q}`;
        }
    });
    await setEachQuarterOfEachModules(await getAll("leads"), leadRow.children);
    await setEachQuarterOfEachModules(await getAll("contacts"), contactRow.children);
    await setEachQuarterOfEachModules(await getAll("accounts"), accountRow.children);
    await setEachQuarterOfEachModules(await getAll("deals"), dealRow.children);
    
}
setQuarterYearPerformance();

async function setEachQuarterOfEachModules(arrOfData, nodeList) {
    let firstQuarter = 0 ;
    let secondQuarter = 0;
    let threeQuarter = 0;
    let fourthQuarter = 0 ;
    arrOfData.forEach(record => {
        let leadDate = new Date(record.date);
        let month = leadDate.getMonth();
        if(([0,1,2]).includes(month)){
            firstQuarter++;
        }     
        else if(([3,4,5]).includes(month)){
            secondQuarter++;
        }  
        else if(([6,7,8]).includes(month)){
            threeQuarter++;
        }
        else if(([9,10,11]).includes(month)){
            fourthQuarter++;
        }
    });
    nodeList[1].textContent = firstQuarter;
    nodeList[2].textContent = secondQuarter;
    nodeList[3].textContent = threeQuarter;
    nodeList[4].textContent = fourthQuarter;
}