// let url=window.location.search;
// let param=new URLSearchParams(url);
// let code=param.get("code");
// let loc = param.get("location");

// const { functions } = require("lodash");

// const { get } = require("lodash");

// const { get } = require("lodash");

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

let row1_Cards = document.querySelectorAll(".row1-cards");

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

async function setCountOfFirstRow(leadList, contactList, accountList, dealList) {
    let leadCount = 0 ;
    let dealCount = 0 ;
    let revenueAmount = 0 ;
    let dealClosingCount = 0;
    let arrOfList = [await leadList, await contactList, await accountList, await dealList];
    let currentDate = new Date();
    arrOfList.forEach(list => {
        list.forEach(record => {
                let recordDate = new Date(record.date);
                if(recordDate.getMonth() === currentDate.getMonth()){
                    if(arrOfList.indexOf(list) === 0 ){
                        leadCount++;
                    }   
                    else if(arrOfList.indexOf(list) === 3){
                        dealCount++;
                    }
                }
                let closingDate = new Date(record.closingDate);
                if(closingDate.getMonth() === currentDate.getMonth()){
                    dealClosingCount++;
                }
                if((record.stage) === ("won" || "closed Won" || "l5")){
                    revenueAmount += record.amount;
                }
        });
    });
    (document.querySelector(".this-month-lead-count")).textContent = leadCount;
    (document.querySelector(".this-month-deals-count")).textContent = dealCount;
    (document.querySelector(".revenue-amount-sum")).textContent = revenueAmount;
    (document.querySelector(".deal-closing-count")).textContent = dealClosingCount;
}
async function setCount() {
    let leadData = await getAll("leads");
    leadCount.textContent = await leadData.length;
    let contactData = await getAll("contacts");
    contactCount.textContent = await contactData.length;
    let accountData = await getAll("accounts");
    accountCount.textContent = await accountData.length;
    let dealData = await getAll("deals");
    dealCount.textContent = await dealData.length;
    await setCountOfFirstRow(leadData, contactData, accountData, dealData);
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
    columnTitle.forEach(element => {
        if((Array.from(columnTitle).indexOf(element)) !== 0 ){
            element.textContent = `FY ${currentDate.getFullYear()} - Q${++q}`;
        }
    });
    await setEachQuarterOfEachModules(await getAll("leads"), leadRow.children, false);
    await setEachQuarterOfEachModules(await getAll("contacts"), contactRow.children, false);
    await setEachQuarterOfEachModules(await getAll("accounts"), accountRow.children, false);
    await setEachQuarterOfEachModules(await getAll("deals"), dealRow.children, false);
    await setEachQuarterOfEachModules(await getAll("deals"), dealWonRow.children, true);
}
setQuarterYearPerformance();

async function setEachQuarterOfEachModules(arrOfData, nodeList, flag) {
    let firstQuarter = 0;
    let secondQuarter = 0;
    let threeQuarter = 0;
    let fourthQuarter = 0;
    let arrayOfData = await arrOfData;
    if(flag){
        arrOfData.forEach(async element => {
            if((element.stage) === ("won" || "closed Won" || "l5")){
                await arrayOfData.push(element);
            }
        });
    }
    arrayOfData.forEach(record => {
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

// Graphical Representation of Records
async function setBarChart() {
    const xArray = ["Leads", "Contacts", "Accounts", "Deals"];
    const yArray = [];
    let leadData = await getAll("leads");
    yArray.push(leadData.length);
    let contactData = await getAll("contacts");
    yArray.push(contactData.length);
    let accountData = await getAll("accounts");
    yArray.push(accountData.length);
    let dealData = await getAll("deals");
    yArray.push(dealData.length);
    const data = [{
    x:xArray,
    y:yArray,
    type:"bar",
    orientation:"v",
    marker: {color:"rgba(0, 0, 255, 0.46)"}
    }];
    const layout = {title:"Records Created"};
    Plotly.newPlot("bar-chart", data, layout);
}

async function setDonutChart() {
    const xxArray = ["Leads", "Contacts", "Accounts", "Deals"];
    const yyArray = [];
    let leadData = await getAll("leads");
    yyArray.push(leadData.length);
    let contactData = await getAll("contacts");
    yyArray.push(contactData.length);
    let accountData = await getAll("accounts");
    yyArray.push(accountData.length);
    let dealData = await getAll("deals");
    yyArray.push(dealData.length);
    // xxArray.forEach(async element => {
    //     let data = await getAll((element).toLocaleLowerCase());
    //     yyArray.push(data.length*10); 
    // });
    const layout2 = {title:"Records Created"};
    const data2 =[{labels:xxArray, values:yyArray, hole:.4, type:"pie"}];
    await Plotly.newPlot("donut-chart", data2, layout2);
}
setBarChart();
setDonutChart();

function addToObject(obj, newObj) {
    for (const key in obj) {
        newObj[key] = obj[key];
    }
}
async function pipeLineChart() {
    const xValues = [];
    const yValues = [];
    let pipelineList = await getAll("pipeLines");
    let deals = await getAll("deals");
    let object1 = {};
    pipelineList.forEach(obj => {
        if(obj.standard){
            addToObject(obj.standard, object1);
        }
        else if(obj.deepa){
           addToObject(obj.deepa, object1);
        }
        else if(obj.Newe){
            addToObject(obj.Newe, object1);
        }
    });
    for (const key in object1) {
        xValues.push(key);
    }
    for (let i = 0; i < xValues.length; i++) {
        yValues[i] = 0 ;
        deals.forEach(element => {
            if(element.stage === xValues[i]){
                yValues[i]++;
            }
        });
    }
    const barColors = [
        "Red",
        "#5733FF",  // Hex: Blue shade
        "Green",
        "Black",
        "hsl(60, 100%, 50%)",  // HSL: Yellow
        "hsla(0, 100%, 50%, 0.6)", // HSLA: Semi-transparent Red
        "White",
        "Crimson",
        "Teal",
        "CornflowerBlue",
        "LightGray",
        "DarkSlateGray",
        "#FF5733",  // Hex: Orange shade
        "#33FF57",  // Hex: Green shade
        "rgb(255, 99, 71)",   // RGB: Tomato
        "Blue",
        "Yellow",
        "rgb(144, 238, 144)", // RGB: LightGreen
        "rgba(255, 165, 0, 0.8)", // RGBA: Orange with transparency
        "hsl(240, 100%, 50%)", // HSL: Pure Blue
      ];
      

    new Chart("pipeline-chart", {
    type: "bar",
    data: {
        labels: xValues,
        datasets: [{
        backgroundColor: barColors,
        data: yValues
        }]
    },
    options: {
        responsive:true,
        maintainAspectRatio:false,
        legend: {display: false},
        title: {
        display: true,
        text: "PipeLine By Stages"
        }
    }
    });
}
pipeLineChart();