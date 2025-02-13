// 1. get meeting key from url
let currentUrl = window.location.search;
let param = new URLSearchParams(currentUrl);
let meetingK = param.get("meetingKey");

// i) If it is Past Meeting
let past = param.get("pastMeeting");
let url = "https://dmock-crm.vercel.app/";
console.log(past);

let listOfMeetings;
let editBtn = document.querySelector("#edit");
let deleteBtn = document.querySelector("#cancel");
// ii) Alter UI to past meeting view
if (past) {
    let btns = document.querySelector("#btns");
    while (btns.hasChildNodes()) {
        btns.childNodes[0].remove();
    }
    btns.innerHTML = `<button type="button" id="edit" class="btnsInMeetingView repeatMeet" style="width:140px" onclick="editMeeting(${meetingK})">Repeat meeting</button>
                    <button type="button" id="cancel" class="btnsInMeetingView" onclick=deleteMeeting(${meetingK})>Cancel</button>`;

    let forCompleted = document.querySelector("#forCompleted");
    let completed = document.createElement("button");
    forCompleted.appendChild(completed);
    completed.innerHTML = "Completed";
    completed.style.cssText = `border:1px solid green;
                             background-color:green;
                             height:25px;
                             width:100px;
                             border-radius:16px;
                             color:white;
                             font-size:14px`;

}
else {
    //Buttons
    let startMeetingBtn = document.querySelector("#startMeeting");
    // StartMeeting
    startMeetingBtn.addEventListener("click", (e) => {
        e.preventDefault();
        startMeeting(meetingK);
    });
}

//function for repeat meeting
function editMeeting(meetingKey) {
    window.location.href = `/html/meetings/scheduleMeeting.html?meetingToBeEdited=${meetingKey}`
}

//Header
let topic = document.querySelector("#meetingTopicForHeader");

// 1. Get Meeting Details
async function getMeetingObj() {
    try {
        let res = await fetch(`/meeting/getmeeting/${meetingK}`, {
            method: "GET"
        });
        let response = await res.json();
        if (res.ok) {
            console.log(response.session);
            displayMeetingDetail(response.session);

        }
        else throw new Error("Error: " + res.statusText + " " + res.status)
    } catch (error) {

    }
}
getMeetingObj(); // Execution starts from here

let innerContainer = document.querySelector("#innerContainer");

// Display Meeting Details 
function displayMeetingDetail(obj) {
    topic.innerHTML = obj.topic;
    innerContainer.innerHTML = structure(obj);
}


async function startMeeting(meetingKey) {
    try {
        let res = await fetch(`/meeting/getmeeting/${meetingKey}`, {
            method: "GET"
        });
        let response = await res.json();
        if (res.ok) {
            console.log(response.session);
            let startTime = response.session.startTimeMillisec;
            let duration = response.session.duration;
            let calculateEndTimeOfMeeting = startTime + duration;
            if(((response.session.startTimeMillisec)-600000)<=Date.now() && !(Date.now())>(calculateEndTimeOfMeeting+1000)){
                window.open(response.session.startLink, "_blank");
            }
            else{
                alert("Meeting can be start before 10mins of start Time")
                if(confirm("Do You Want Start Immediately? press OK")){
                    window.open(response.session.startLink, "_blank")
                }
            }
        }
        else throw new Error("Error: " + res.statusText + " " + res.status)

    } catch (error) {

    }
}

// Edit meeting details
editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `/html/meetings/scheduleMeeting.html?meetingToBeEdited=${meetingK}`;
})
//delete meeting - Click Event
deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are You sure? delete meeting")) {
        deleteMeeting(meetingK)
    }
})

// DeleteMeeting
async function deleteMeeting(meetingKey) {
    // confirm("Are you sure to cancel/Delete meeting?")
    let res = await fetch(`/meeting/deletemeeting/${meetingKey}`, {
        method: "DELETE"
    });
    // let response=await res.json();
    if (res.status == "204");
    {
        alert("Meeting Deleted!")
        window.location.href = `/html/meetings/upcomingMeetings.html`
    }
}
//Back to previous page
let backBtn = document.querySelector("#backBtn");
backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
});

// Structure For Display meeting Details
function structure(obj) {
    let meetingStructure = `<div class="colInDisplayMeet">
                        <div class="iconContainer">
                            <div class="imgContainer" id="calendar">
                                <img src="/assets/meetingImages/calendar.svg" alt="">
                            </div>
                        </div>
                        <div class="textContainer">
                            <h4 class="time">${obj.timeFormat} <span>${obj.durationInHours}</span</h4>
                            <h5 class="timeZone">${obj.timezone}</h5>
                        </div>
                    </div>
                    <div class="colInDisplayMeet">
                        <div class="iconContainer">
                            <div class="imgContainer" id="host">
                                <img src="/assets/meetingImages/cohost-icon.svg" alt="">
                            </div>
                        </div>
                        <div class="textContainer" id="hostTextContainer">
                            <div>
                                <h4 class="host">Host</h4>
                                <h4>${obj.presenterEmail}</h4>
                            </div>
                            <div>
                                <h4>Department</h4>
                                <h5>${obj.departmentName}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="colInDisplayMeet">
                        <div class="iconContainer">
                            <div class="imgContainer" id="participant">
                                <img src="/assets/meetingImages/participants.svg" alt="">
                            </div>
                        </div>
                        <div class="textContainer">
                            <h4> "Participant-Count" participant</h4>
                            <h4>${obj.joinLink}</h4>
                            <h4>Meeting ID: ${obj.meetingKey}    |    Password: ${obj.pwd}</h4>
                        </div>
                    </div>
                    <div class="colInDisplayMeet">
                        <div class="iconContainer">
                            <div class="imgContainer" id="reminder">
                                <img src="/assets/meetingImages/reminder-icon.svg" alt="">
                            </div>
                        </div>
                        <div class="textContainer">
                            <h4>Reminders: ${(obj.reminderDetails).length}</h4>
                            <h5>${obj.reminderDetails[0].timeFormat}</h5>
                        </div>
                    </div>
                    <div class="colInDisplayMeet">
                        <div class="iconContainer">
                            <div class="imgContainer" id="agenda">
                                <img src="/assets/meetingImages/agenda-icon.svg" alt="">
                            </div>
                        </div>
                        <div class="textContainer">
                            <h4>Agenda</h4>
                            <h4>${obj.agenda}</h4>
                        </div>
                    </div>`

    return meetingStructure;
}