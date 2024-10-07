// import dao from "../controller/dao.js";
// let getAllMeetings=new dao('http://localhost:5500/getmeetinglist');

// const { forIn } = require("lodash");

// let res=getAllMeetings.getAll();

// console.log(res);
let url="https://dmock-crm.vercel.app/";
async function getlistOfMeeting() {
    try {
        let res=await fetch('/getmeetinglist', {
            method:"GET"
        });
        let response=await res.json();
        if(res.ok)
        {
            console.log(response.session);
            createList(response.session)
        }
        else throw new Error("Error: "+ res.statusText+" "+res.status)
    } catch (error) {
        
    }

}
getlistOfMeeting()

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
                image.src=`./meetingImages/morningTime.svg`;
                break;
            case "AFTERNOON":
                image.src=`./meetingImages/afternoonTime.svg`;
                break;
            case "EVENING":
                image.src='./meetingImages/eveningTime.svg';
                break;
            case "NIGHT":
                image.src='./meetingImages/nightTime.svg';
            default:
                break;
        }
        for (const key in obj) {
        }
    });
}


