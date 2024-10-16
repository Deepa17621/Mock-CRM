let currentUrl=window.location.search;
let param=new URLSearchParams(currentUrl);
let meetingK=param.get("meetingKey");
let url="https://dmock-crm.vercel.app/";
let listOfMeetings;
//Buttons
let startMeetingBtn=document.querySelector("#startMeeting");
let editBtn=document.querySelector("#edit");
let deleteBtn=document.querySelector("#cancel");
//Header
let topic=document.querySelector("#meetingTopicForHeader");
async function getMeetingObj() {
    try {
        let res=await fetch(`/getmeeting/${meetingK}`, {
            method:"GET"
        });
        let response=await res.json();
        if(res.ok)
        {
            console.log(response.session);
            displayMeetingDetail(response.session);

        }
        else throw new Error("Error: "+ res.statusText+" "+res.status)
    } catch (error) {
        
    }
}
getMeetingObj(); // Execution starts from here

// Display Meeting Details 
function displayMeetingDetail(obj)
{
    topic.innerHTML=obj.topic;
}

// StartMeeting
startMeetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    startMeeting(meetingK);
});

//delete meeting
deleteBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(confirm("Are You sure? delete meeting"))
    {
        deleteMeeting(meetingK)
    }
})
async function startMeeting(meetingKey) {
    try {
        let res=await fetch(`/getmeeting/${meetingKey}`, {
            method:"GET"
        });
        let response=await res.json();
        if(res.ok)
        {
            console.log(response.session);
            window.location.href=response.session.startLink
        }
        else throw new Error("Error: "+ res.statusText+" "+res.status)
        
    } catch (error) {
        
    }
}

// DeleteMeeting
async function deleteMeeting(meetingKey) {
    confirm("Are you sure to cancel/Delete meeting?")
    let res=await fetch(`/deletemeeting/${meetingKey}`);
    let response=await res.json();
    if(res.status=="204");
    {
        alert("Meeting Deleted!")
    }
}