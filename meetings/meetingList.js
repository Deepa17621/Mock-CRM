// Fetch to get the meeting list from meeting API
async function getList() {
    try {
        const res=await fetch('http://localhost:5500/getmeetinglist');
        let meetingList=await res.json();
        if(!res.ok)
        {
            throw new Error("Error in URL"+res.status);
        }
            console.log(meetingList);
            console.log(meetingList["session"]);
            sendToTable(meetingList["session"]);
    } catch (error) {
        console.log(error);  
    }
}

    getList();  // Execution Starts Here...

    // Table to List All the meetings

    let table=document.querySelector("#meetingListTable");
    let tHead=document.querySelector("thead");
    let tBody=document.querySelector("tbody");
function sendToTable(obj)
{
    //Table Head
    let thead=document.createElement("tr");
    tHead.appendChild(thead);
    let theadArr=["Title", "From", "To", "Host"];
    theadArr.forEach(e=>{
        let th=document.createElement("th");
        th.innerHTML=e;
        thead.appendChild(th)
    });
    for (let i = 0; i < obj.length; i++) {
        let tr=document.createElement("tr");
        tBody.appendChild(tr);
        let titleTD=document.createElement("td");
        tr.appendChild(titleTD);
        titleTD.innerHTML=obj[i]["topic"];
        titleTD.setAttribute("id", obj[i]["meetingKey"])
        titleTD.setAttribute("onclick", "rowClickedEvent(this.id)");
        titleTD.style.cursor="pointer";
        let fromTD=document.createElement("td");
        tr.appendChild(fromTD);
        fromTD.innerHTML=obj[i]["startTime"];
        let toTD=document.createElement("td");
        tr.appendChild(toTD);
        toTD.innerHTML=obj[i]["endTime"];
        let hostTD=document.createElement("td");
        tr.appendChild(hostTD);
        hostTD.innerHTML=obj[i]["presenterFullName"];
        
    }
}
// Row Clicked Event===> To Display Meeting Details

function rowClickedEvent(meetingKey)
{
    window.location.href=`/meetings/viewMeeting.html?meetingKey=${meetingKey}`;
}

// 1. Meeting Creation Event-----> Create Meeting <----------
let dialog=document.querySelector("#dialogbox");
let meetingBtn=document.querySelector("#createMeeting");
let meetingCancelBtn=document.querySelector("#meetingCancelBtn");
meetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    dialog.showModal();
});

// Meeting close event-dialog box closing event
meetingCancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    dialog.close();
    window.location.href=`../meetings/meetingList.html`;
});

// meeting save button
let meetingSaveBtn=document.querySelector("#meetingSaveBtn");

meetingSaveBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    meetingForm.requestSubmit();
});
// Meeting Form Data
let meetingTopic=document.querySelector("#topic");
let startTime=document.querySelector("#startTime");
let agenda=document.querySelector("#agenda");
// let endTime=document.querySelector("#endTime");
let presenterId=document.querySelector("#presenterId");
let participants=document.querySelector("#participants");
// Meeting Form  submit Event
const meetingForm=document.querySelector("#meetingForm");
meetingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(startTime.value);
    
    // Request Body
    const session = {
        "session": {
            "topic": meetingTopic.value,
            "agenda": agenda.value,
            "presenter": presenterId.value,
            "startTime": "Jun 19, 2025 07:00 PM",
            "timezone": "Asia/Calcutta",
            "participants": [
                {
                    "email": participants.value
                }
            ]
        }
    };

    try {
        const response = await fetch('http://localhost:5500/postmeeting', {
            method: 'POST',
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
        let newMeetingResStoredInJson=await fetch(`http://localhost:3000/meetings`, 
            {
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(responseBody)
            }
        );
        if(!newMeetingResStoredInJson.ok)
        {
            throw new Error("Meeting Data Not Stored In Json File");
        }
        window.location.href=`../meetings/meetingList.html`;
        alert("Meeting Created SuccessFully");
        console.log(responseBody);
    } catch (error) {
        console.error("Error:", error);
    }
});


