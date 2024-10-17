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
        }
        else throw new Error("Error: "+ res.statusText+" "+res.status)
    } catch (error) {
        
    }
}
getlistOfMeeting(); // Execution starts from here

// Navigate From Upcoming to Past And Past To Upcoming Meeting
let upComingLink=document.querySelector("#upComingLink");
let pastLink=document.querySelector("#pastLink");
let personalRoom=document.querySelector("#personalRoom");

// click event for navigate from upcoming to past
upComingLink.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`../meetings/zohoMeetingmeetings.html`;
});
pastLink.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`../meetings/pastMeeting.html`;
});
personalRoom.addEventListener("click", (e)=>{
    e.preventDefault();
    //Need to write code here--->?(FIX)
});
// List-Down All the Meetings
let wrapperForMeetingList=document.querySelector(".actualListContainer");
let wrapperForToday=document.querySelector(".wrapperForToday");
let wrapperForTomorrow=document.querySelector(".wrapperForTomorrow");
let wrapperForLater=document.querySelector(".wrapperForLater");

function createList(arrOfObj){
    arrOfObj.forEach(obj => {
        let li=document.createElement("li");
        li.className="list"
        li.setAttribute("id", obj.meetingKey);
        li.addEventListener("click", (e)=>{
            e.preventDefault();
            window.location.href=`../meetings/displayMeetingDetail.html?meetingKey=${obj.meetingKey}`
        });
        if(obj.eventTime=="Later")
        {
            if((obj.startTimeMillisec)>=(Date.now()))
            {
                if(!wrapperForLater.hasChildNodes())
                    {
                        let h4=document.createElement("h4");
                        wrapperForLater.appendChild(h4)
                        h4.innerHTML="Later";
                    }
                li.innerHTML=listStructure(obj);
                wrapperForLater.appendChild(li);
            }
        }
        else if(obj.eventTime=="Today")
        {
            if((obj.startTimeMillisec)>=(Date.now()))
            {
                if(!wrapperForToday.hasChildNodes())
                {
                    let h4=document.createElement("h4");
                    wrapperForToday.appendChild(h4);
                    h4.innerHTML="Today"
                }
                li.innerHTML=listStructure(obj);
                wrapperForToday.appendChild(li);
            }
                
        }
        else if(obj.eventTime=="Tomorrow")
        {
            if((obj.startTimeMillisec)>=(Date.now()))
            {
                if(!wrapperForTomorrow.hasChildNodes())
                {
                    let h4=document.createElement("h4");
                    wrapperForTomorrow.appendChild(h4);
                    h4.innerHTML="Tomorrow";
                }
                li.innerHTML=listStructure(obj);
                wrapperForTomorrow.appendChild(li);
            }
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

// Schedule Meeting
let scheduleMeeting=document.querySelector("#schedule");
scheduleMeeting.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`../meetings/zMeetingCreate.html`;
});

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
            <span>${meetingObj.topic}</span>
        </div>
        <div class="hostNameContainer division">
            <span><img src=${meetingObj.presenterAvatar} alt="host-Avatar" id="avatarImg"></span>
            <span id="presenterName">${meetingObj.presenterFullName}</span>
        </div>
        <div class="startBtnContainer division">
            <button id="startBtn" onclick="startMeeting(${meetingObj.meetingKey})">Start</button>
             <span id="meetingOptions" onclick="dropDown(${meetingObj.meetingKey})">
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
        console.log(obj);
        console.log(obj.session.startLink);
        if(confirm("start Immediately?"))
        {
            window.location.href=obj.session.startLink;
        }
    } catch (error) {
        
    }
}

// Delete Meeting
async function deleteMeeting(meetingKey) {
    confirm("Are you sure to cancel/Delete meeting?")
    let res=await fetch(`/deletemeeting/${meetingKey}`);
    let response=await res.json();
    if(res.status=="204");
    {
        alert("Meeting Deleted!")
    }
}

// DropDown Menu - Three Dots
// let dropDownDiv=document.querySelector("#dropDown");
// console.log(dropDown);

// function dropDown(meetingKey)
// {

// }
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

