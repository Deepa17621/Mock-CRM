// 1. Navigate From Upcoming to Past And Past To Upcoming Meeting
let upComingLink = document.querySelector("#upComingLink");
let pastLink = document.querySelector("#pastLink");
let personalRoom = document.querySelector("#personalRoom");

// click event for navigate from upcoming to past
upComingLink.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/html/meetings/zohoMeetingmeetings.html`;
});
pastLink.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/html/meetings/pastMeeting.html`;
});
personalRoom.addEventListener("click", (e)=>{
    e.preventDefault();
    //Need to write code here--->?(FIX)
});

// 2. Get Meeting List From APIResponse
let url="https://dmock-crm.vercel.app/";
let listOfMeetings;

async function getlistOfMeeting() {
    try {
        let res=await fetch('/meeting/getmeetinglist', {
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

// List-Down All the Meetings
let wrapperForMeetingList = document.querySelector(".actualListContainer");
let wrapperForYesterday   = document.querySelector(".wrapperForYesterday");
let wrapperForThisWeek    = document.querySelector(".wrapperForThisWeek");
let wrapperForLastWeek    = document.querySelector(".wrapperForLastWeek");
let wrapperForLastMonth   = document.querySelector(".wrapperForLastMonth");
let wrapperForLastYear    = document.querySelector(".wrapperForLastYear");
let wrapperForThisMonth   = document.querySelector(".wrapperForThisMonth");
let wrapperForEarlier     = document.querySelector(".wrapperForEarlier");

function createList(arrOfObj){
    arrOfObj.forEach(obj => {
        let li=document.createElement("li");
        li.className="list";
        li.setAttribute("id", obj.meetingKey);
        li.addEventListener("click", (e)=>{
            e.preventDefault();
            window.location.href=`/html/meetings/displayMeetingDetail.html?meetingKey=${obj.meetingKey}&pastMeeting=${true}`;
        });
        if(obj.eventTime=="Yesterday")
        {
            if((obj.startTimeMillisec)<(Date.now()))
            {
                if(!wrapperForYesterday.hasChildNodes())
                    {
                        let h4=document.createElement("h4");
                        wrapperForYesterday.appendChild(h4)
                        h4.innerHTML="Yesterday";
                    }
                li.innerHTML=listStructure(obj);
                wrapperForYesterday.appendChild(li);
            }
        }
        else if(obj.eventTime=="This Month" && ((obj.startTimeMillisec)<(Date.now())))
            {
                    if(!wrapperForThisMonth.hasChildNodes())
                    {
                        let h4=document.createElement("h4");
                        wrapperForLastYear.appendChild(h4);
                        h4.innerHTML="This Month";
                    }
                    li.innerHTML=listStructure(obj);
                    wrapperForThisMonth.appendChild(li);
            }
        else if(obj.eventTime=="This Week" && ((obj.startTimeMillisec)<(Date.now())))
        {
                if(!wrapperForThisWeek.hasChildNodes())
                {
                    let h4=document.createElement("h4");
                    wrapperForThisWeek.appendChild(h4);
                    h4.innerHTML="This Week"
                }
                li.innerHTML=listStructure(obj);
                wrapperForThisWeek.appendChild(li);
        }
        else if(obj.eventTime=="Last Week")
            {
                if((obj.startTimeMillisec)<(Date.now()))
                {
                    if(!wrapperForLastWeek.hasChildNodes())
                    {
                        let h4=document.createElement("h4");
                        wrapperForLastWeek.appendChild(h4);
                        h4.innerHTML="Last Week"
                    }
                    li.innerHTML=listStructure(obj);
                    wrapperForLastWeek.appendChild(li);
                }
                    
            }
        else if(obj.eventTime=="Last Month")
        {
            if((obj.startTimeMillisec)<(Date.now()))
            {
                if(!wrapperForLastMonth.hasChildNodes())
                {
                    let h4=document.createElement("h4");
                    wrapperForLastMonth.appendChild(h4);
                    h4.innerHTML="Last Month";
                }
                li.innerHTML=listStructure(obj);
                wrapperForLastMonth.appendChild(li);
            }
        }  //Earlier
        else if(obj.eventTime=="Last Year")
            {
                if((obj.startTimeMillisec)<(Date.now()))
                {
                    if(!wrapperForLastYear.hasChildNodes())
                    {
                        let h4=document.createElement("h4");
                        wrapperForLastYear.appendChild(h4);
                        h4.innerHTML="Last Year";
                    }
                    li.innerHTML=listStructure(obj);
                    wrapperForLastYear.appendChild(li);
                }
            }

            else if(obj.eventTime=="Earlier")
                {
                    if((obj.startTimeMillisec)<(Date.now()))
                    {
                        if(!wrapperForEarlier.hasChildNodes())
                        {
                            let h4=document.createElement("h4");
                            wrapperForEarlier.appendChild(h4);
                            h4.innerHTML="Earlier";
                        }
                        li.innerHTML=listStructure(obj);
                        wrapperForEarlier.appendChild(li);
                    }
                }
    });
}

// Time Image Function
function setImage(time)
{
    switch (time) {
        case "MORNING":
            return`/assets/meetingImages/morningTime.svg`;
        case "AFTERNOON":
            return `/assets/meetingImages/afternoonTime.svg`;
        case "EVENING":
            return '/assets/meetingImages/eveningTime.svg';
        case "NIGHT":
            return '/assets/meetingImages/nightTime.svg';
        default:
            break;
    }
}
// Schedule Meeting
let scheduleMeeting=document.querySelector("#schedule");
scheduleMeeting.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/html/meetings/zMeetingCreate.html`;
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
            
        </div>
        `;
        return structure;
}

// Function to start a Meeting for each Meeting
async function startMeeting(meetingKey) {
    try {
        let res=await fetch(`/meeting/getMeeting/${meetingKey}`);
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
    let res=await fetch(`/meeting/deletemeeting/${meetingKey}`);
    let response=await res.json();
    if(res.status=="204");
    {
        alert("Meeting Deleted!")
    }
}