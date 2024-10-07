// import dao from "../controller/dao.js";
// let getAllMeetings=new dao('http://localhost:5500/getmeetinglist');

// const { forIn } = require("lodash");

// let res=getAllMeetings.getAll();

// console.log(res);
let url="https://dmock-crm.vercel.app/";
let listOfMeetings;
async function getlistOfMeeting() {
    try {
        let res=await fetch('/getmeetinglist', {
            method:"GET"
        });
        let response=await res.json();
        if(res.ok)
        {
            console.log(response.session);
            createList(response.session);
            listOfMeetings=response.session;
        }
        else throw new Error("Error: "+ res.statusText+" "+res.status)
    } catch (error) {
        
    }
}
getlistOfMeeting()
console.log("Global Variable:");
console.log(listOfMeetings);


// List-Down All the Meetings
let wrapperForMeetingList=document.querySelector(".actualListContainer");

function createList(arrOfObj){
    arrOfObj.forEach(obj => {
        let myDiv=document.createElement("div");
        wrapperForMeetingList.appendChild(myDiv);
        let spanForImg=document.createElement("span");
        let image=document.createElement("img");
        myDiv.appendChild(spanForImg);
        spanForImg.appendChild(image);
        switch (obj.timePeriod) {
            case "MORNING":
                image.src=`../meetingImages/morningTime.svg`;
                break;
            case "AFTERNOON":
                image.src=`../meetingImages/afternoonTime.svg`;
                break;
            case "EVENING":
                image.src='../meetingImages/eveningTime.svg';
                break;
            case "NIGHT":
                image.src='../meetingImages/nightTime.svg';
            default:
                break;
        }
        let divForDateTime=document.createElement("div")
        divForDateTime.className="divForDateTime";
        let spanForDate=document.createElement("span");
        myDiv.appendChild(spanForDate);
        spanForDate.innerHTML=obj.sDate;
        let spanForTime=document.querySelector("span");


    });
}


