// 1. Display Time In Home Page
let currentTimeContainer = document.querySelector("#currentTime");
let imgTagForTime = document.querySelector("#imgForClock");

const date = new Date()
const df = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit'
});

console.log(df.format(date));
let ampm = date.getHours() >= 12 ? "PM" : "AM";
currentTimeContainer.innerHTML = `${df.format(date)} <span id="center" style="margin-top:5px"><b>.</b></span> ${date.getHours() > 12 ? ('0' + (date.getHours() - 12)) : (date.getHours())}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()} ${ampm}`;

// function to setImage based on time
function setImage() {
    if ((date.getHours()) >= 7 && (date.getHours()) <= 11) {
        imgTagForTime.setAttribute("src", `/assets/meetingImages/morningTime.svg`);
    }
    else if ((date.getHours()) > 11 && (date.getHours()) <= 15) {
        imgTagForTime.setAttribute("src", "/assets/meetingImages/afternoonTime.svg");
    }
    else if ((date.getHours()) >= 15 && (date.getHours()) <= 17) {
        imgTagForTime.setAttribute("src", "/assets/meetingImages/eveningTime.svg");
    }
    else if ((date.getHours()) >= 18 && (date.getHours()) <= 24 && (date.getHours()) <= 5) {
        imgTagForTime.setAttribute("src", "/assets/meetingImages/nightTime.svg");
    }
}
setImage();

// 2. Meet Now Button and Schedule Button Events
let meetNowBtn = document.querySelector("#meetNowBtn");
let scheduleMeetBtn = document.querySelector("#scheduleBtn");
let broadCastNowBtn = document.querySelector("#broadCastNowBtn");
let scheduleWebinarBtn = document.querySelector("#scheduleBtnForWebinar");

// 3. Schedule Meeting Event
scheduleMeetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `/html/meetings/scheduleMeeting.html`;
})

// 3. SideBarActive Link Style
// let sideBarList=document.querySelectorAll(".sideBarList");
// sideBarList.forEach( link=> {
//     link.addEventListener("click", (e)=>{
//         e.preventDefault();
//         link.classList("active")
//     })
// });


