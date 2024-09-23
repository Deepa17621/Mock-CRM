
// Getting Meeting key From URL
let url=window.location.search;
let param=new URLSearchParams(url);
let meetingKey=param.get("meetingKey");
console.log(meetingKey);
let meetingObject;

// Get Meeting Details Using MeetingKey
async function getMeeting(meetingKey) {
    try {
        let res=await fetch(`http://localhost:5500/getmeeting/${meetingKey}`);
        let meetingObj=await res.json();
    if(!res.ok)
    {
        throw new Error("Error in URL"+res.status);
    }
    console.log(meetingObj);
    meetingObject=await meetingObj.session;
    display(meetingObj);
    sendToEditForm(meetingObj.session);
    } catch (error) {
        console.log(error);
    }
}

getMeeting(meetingKey);
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
    // Participant Details
    // let participantContainer=document.querySelector("#participantsContainer");
    // let participantHtml=``
    
}

//  Button Click Events
let startMeetingBtn=document.querySelector(`#startMeetBtn`);
let editMeetingBtn=document.querySelector("#editMeetBtn");
let deleteMeetingBtn=document.querySelector("#deleteMeetBtn");

startMeetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
});

deleteMeetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    deleteMeeting(meetingKey);
});

async function deleteMeeting(meetingKey) {
    try {
        let res=await fetch(`http://localhost:5500/deletemeeting/${meetingKey}`,{method:"DELETE"});
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
    dialog.close();
    window.location.href=`meetings/meetingList.html`;
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


