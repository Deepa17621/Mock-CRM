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
            // return response.session;
        }
        else throw new Error("Error: "+ res.statusText+" "+res.status)
    } catch (error) {
        
    }
}
getlistOfMeeting()
// getlistOfMeeting().then((arr)=>{
//     listOfMeetings=arr;
// }).then(()=>{createList(listOfMeetings)}); // Execution starts Here....


// List-Down All the Meetings
let wrapperForMeetingList=document.querySelector(".actualListContainer");
let wrapperForToday=document.querySelector(".wrapperForToday");
let wrapperForTomorrow=document.querySelector(".wrapperForTomorrow");
let wrapperForLater=document.querySelector(".wrapperForLater");

function createList(arrOfObj){
    arrOfObj.forEach(obj => {
        let li=document.createElement("li");
        li.className="list"
        if(obj.eventTime=="Later")
        {
            if(!wrapperForLater.hasChildNodes)
                {
                    let h2=document.createElement("h2");
                    h2.innerHTML="Later";
                    wrapperForLater.appendChild(h2)
                }
            li.innerHTML=listStructure(obj);
            wrapperForLater.appendChild(li);
        }
        else if(obj.eventTime="Today")
        {
            if(!wrapperForToday.hasChildNodes)
                {
                    let h2=document.createElement("h2");
                    h2.innerHTML="Today"
                    wrapperForToday.appendChild(h2)
                }
            li.innerHTML=listStructure(obj);
            wrapperForToday.appendChild(li);
        }
        else if(obj.eventTime=="Tomorrow")
        {
            if(!wrapperForTomorrow.hasChildNodes)
                {
                    let h2=document.createElement("h2");
                    h2.innerHTML="Tomorrow";
                    wrapperForTomorrow.appendChild(h2)
                }
            li.innerHTML=listStructure(obj);
            wrapperForTomorrow.appendChild(li);
        }
    });
}

// Time Image Function
function setImage(time)
{
    switch (time) {
        case "MORNING":
            return`../meetingImages/morningTime.svg`;
        case "AFTERNOON":
            return `../meetingImages/afternoonTime.svg`;
        case "EVENING":
            return '../meetingImages/eveningTime.svg';
        case "NIGHT":
            return '../meetingImages/nightTime.svg';
        default:
            break;
    }
}

// List Html Structure Function
function listStructure(meetingObj)
{
    let structure=`
        <div class="dateTimeContainer division">
            <span><img src=${setImage(meetingObj.timePeriod)} alt="Time-Image"></span>
            <div id="dateTime">
                <span>${meetingObj.sDate}</span>
                <span id="meetingTime">${meetingObj.sTime} . ${meetingObj.durationInHours}</span>
            </div>
        </div>
        <div class="topicContainer division">
            <span><b>${meetingObj.topic}</b></span>
        </div>
        <div class="hostNameContainer division">
            <span><img src=${meetingObj.presenterAvatar} alt="host-Avatar" id="avatarImg"></span>
            <span id="presenterName">${meetingObj.presenterFullName}</span>
        </div>
        <div class="startBtnContainer division">
            <button id="startBtn" onclick="startMeeting(${meetingObj.meetingKey})">Start</button>
             <span id="meetingOptions">
                    <svg width="30" height="30" viewBox="0 0 10 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5" cy="9" r="1" fill="#4588F0" stroke="#4588F0" stroke-width="2" />
                        <circle cx="5" cy="15" r="1" fill="#4588F0" stroke="#4588F0" stroke-width="2" />
                        <circle cx="5" cy="21" r="1" fill="#4588F0" stroke="#4588F0" stroke-width="2" />
                    </svg>
             <span>
             <div id="dropDown">
                <ul>
                    <li id="editMeeting">Edit</li>
                    <li id="deleteMeeting" onclick="deleteMeeting(${meetingObj.meetingKey})">Cancel</li>
                </ul>
             </div>
        </div>
        `;
        return structure;
}

// Function to start a Meeting for each Meeting
async function startMeeting(meetingKey) {
    try {
        let res=await fetch(`/getMeeting/${meetingKey}`);
        let obj=await res.json();
        if(!res.ok)
        {
            throw new Error("Error in Url: "+ res.status+ " "+ res.statusText)
        }
        window.location.href=obj.startLink;
    } catch (error) {
        
    }
}

// Delete Meeting
async function deleteMeeting(meetingKey) {
    confirm("Are you sure to cancel meeting?")
    let res=await fetch(`/deletemeeting/${meetingKey}`);
    let response=await res.json();
    if(res.status=="204");
    {
        alert("Meeting Deleted!")
    }
}

// Events for btns
// let meetNow=document.querySelector("#meetNow");
// let scheduleMeetingBtn=document.querySelector("#schedule");
// meetNow.addEventListener("click", (e)=>{
//     e.preventDefault();
//     // Need to learn about sdk api documentaion
// });

// // schedule Meeting
// scheduleMeetingBtn.addEventListener("click", (e)=>{
//     e.preventDefault();
//     // Need to create form to schdule a meeting
// });

// // Meeting Options -- Three Dot Menu Bar 
// let meetingOptios=document.querySelector("#meetingOptions");
// meetingOptios.addEventListener("click", (e)=>{
//     e.preventDefault();

// });
