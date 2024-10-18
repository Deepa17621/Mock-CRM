let url=window.location.search;
let param=new URLSearchParams(url);
let meetingKey=param.get("meetingKey");
console.log(meetingKey);
let meetingObject;

// Get Meeting Details Using MeetingKey
async function getMeetingForDistribution(meetingKey) {
    try {
        let res=await getMeeting(meetingKey);
        let meetingObj=res;
        console.log(meetingObj.session);
    display(meetingObj);
    sendToEditForm(meetingObj.session);
    } catch (error) {
        console.log(error);
    }
}
// Get meeting object
async function getMeeting(meetingKey) {
    try {
        let res=await fetch(`/getmeeting/${meetingKey}`);
        let meetingObj=await res.json();
    if(!res.ok)
    {
        throw new Error("Error in URL"+res.status);
    }
    console.log(meetingObj);
    meetingObject=await meetingObj.session;
    return meetingObj;
    } catch (error) {
        console.log(error);
    }
}
// Function to disable and enable the start meeting button -- Before 15 mins to the meeting
// let currentDateAndTime=new Date()
// currentDateAndTime.getDate();


// Function call to display the meeting details
getMeetingForDistribution(meetingKey);
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

    // Get Meeting Data From Json File using meeting got from api response
    let allMeetingsFromJson=await fetch(`http://localhost:3000/meetings`);
    let meetingObjects=await allMeetingsFromJson.json();
    let meetingObjFromJson=""
    meetingObjects.forEach(e => {
        if(e.session.meetingKey=meetingKey)
        {
            meetingObjFromJson=e;
            return;
        }
    });   
    console.log(meetingObjFromJson);
    let participantsDetails=meetingObjFromJson.session.participants;
    console.log(participantsDetails);
    
     
    // Participant Details
    let participantContainer=document.querySelector("#participantsContainer");
    let secContainer=document.createElement("div");
    participantContainer.appendChild(secContainer);
    participantsDetails.forEach(e => {
        let participantHtml=`<ul class="ulForMeet" style="display:flex;flex-direction:column"><li><a href="mailto:${e.email}">${e.email}</a></li></ul><hr>`
        secContainer.innerHTML=participantHtml
    }); 
}

//  Button Click Events
let startMeetingBtn=document.querySelector(`#startMeetBtn`);
let editMeetingBtn=document.querySelector("#editMeetBtn");
let deleteMeetingBtn=document.querySelector("#deleteMeetBtn");

startMeetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    setStartMeeting();
});

async function setStartMeeting() {
    let obj=await getMeeting(meetingKey);
    let tenMinPrior=(obj.session.startTimeMillisec)-600000;
    console.log(tenMinPrior);    
    if(Date.now()>=tenMinPrior)
    {
        window.location.href=obj.session.startLink;
    }
    else 
    {
        if(confirm("Meeting will start only before 10mins of start time"))
        {
            location.reload();
        }
    }
}
deleteMeetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    deleteMeeting(meetingKey);
});

async function deleteMeeting(meetingKey) {
    try {
        let res=await fetch(`/deletemeeting/${meetingKey}`,{method:"DELETE"});
        let out=await res.json();
        console.log(out);
        
    } catch (error) {
        console.log(error);
    }
}

let dialog=document.querySelector("#dialogbox");
let meetingCancelBtn=document.querySelector("#meetingCancelBtn");

editMeetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    dialog.showModal();
});

// dialog box closing event
meetingCancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/meetings/viewMeeting.html?meetingKey=${meetingKey}`;
    dialog.close();
});

function sendToEditForm(obj)
{
    let existingObj=obj;
    console.log(existingObj);
    
    // meeting save button
    let meetingSaveBtn=document.querySelector("#meetingSaveBtn");

    meetingSaveBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        meetingForm.requestSubmit();
        window.location.href=`../meetings/meetingList.html`;
        alert("Meeting Created SuccessFully");
    });
    // Meeting Form Data
    let meetingTopic=document.querySelector("#topic");
    let mlocation=document.querySelector("#location");
    let startTime=document.querySelector("#startTime");
    let agenda=document.querySelector("#agenda");
    let presenterId=document.querySelector("#presenterId");
    let participants=document.querySelector("#participants");
    
    // preset of Inputs
    meetingTopic.value=existingObj.topic;
    agenda.value=existingObj.agenda;

    // Meeting Form  submit Event
    const meetingForm=document.querySelector("#meetingForm");

    meetingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Request Body
        const session = {
            "session": {
                "topic": meetingTopic.value,
                "agenda": agenda.value,
                "presenter": presenterId.value,
                "startTime": "Sep 20, 2024 07:00 PM",
                "timezone": "Asia/Calcutta",
                "participants": [
                    {
                        "email": participants.value
                    }
                ]
            }
        };

        try {
            const response = await fetch(`/editmeeting/${meetingKey}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(session) // Convert the session object to a JSON string
            });

            if (!response.ok) {
                // If response status is not in the range 200-299, throw an error
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const responseBody = await response.json();
            dialog.close();
            console.log(responseBody);
        } catch (error) {
            console.error("Error:", error);
        }
    });
}

// Navigate to Previous Page- Back To Previous Page
let backBtn=document.querySelector("#backBtn");
backBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.back();
})