
// Getting Meeting key From URL
let url=window.location.search;
let param=new URLSearchParams(url);
let meetingKey=param.get("meetingKey");
console.log(meetingKey);
let meetingObject;

// Get Meeting Details Using MeetingKey
async function getMeeting(meetingKey) {
    try {
        let res=await fetch(`/getmeeting/${meetingKey}`);
        let meetingObj=await res.json();
    if(!res.ok)
    {
        throw new Error("Error in URL"+res.status);
    }
    console.log(meetingObj);
    meetingObject=meetingObj.session;
    display(meetingObj);
    
    } catch (error) {
        console.log(error);
    }
}

getMeeting(meetingKey);
console.log(meetingObject);

let titleContainer=document.querySelector("#titleContainer");
let timeContainer=document.querySelector("#timeContainer");

async function display(sessionObj)
{
    //titleDetails
    let obj=await sessionObj.session;    
    let titleHtml=`<ul class="ulForMeet" style="display:flex;flex-direction:column"><li>${obj.topic}</li>`;
        titleHtml+=`<li>host- <a href="#">${obj.presenterName}</a></li></ul>`
    titleContainer.innerHTML=titleHtml;
    // Time Details
    let timeHtml=`<ul class="ulForMeet" style="display:flex;flex-direction:column"><li>${obj.startTime}</li>`;
        timeHtml+=`<li>${obj.sTime}</li>`;
        timeHtml+=`<li>Notify Participant: ${obj.sTime}</li><ul>`;
        timeContainer.innerHTML=timeHtml;
    
}

//  Button Click Events
let startMeetingBtn=document.querySelector(`#startMeetBtn`);
let editMeetingBtn=document.querySelector("#editMeetBtn");
let deleteMeetingBtn=document.querySelector("#deleteMeetBtn");

startMeetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href= ``
});

deleteMeetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    deleteMeeting(meetingKey);
});

async function deleteMeeting(meetingKey) {
    try {
        let res=await fetch(`/deletemeeting/${meetingKey}`,{method:"DELETE"});
        if(!res.ok && res.status==204)
        {
            alert("Meeting Cancelled");
            // throw new Error(`Error: `+res.status)
        }
        // else if()
        // {
        //     let response=await res.json();
        //     console.log(response);
        //     console.log("Delete started");
            
            
        // }
        
    } catch (error) {
        
    }
}

editMeetingBtn.addEventListener("click", (e)=>{

})
