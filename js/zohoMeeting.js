// Display Time In Home Page
let currentTimeContainer=document.querySelector("#currentTime");
let imgTagForTime=document.querySelector("#imgForClock");

let currentTime=new Date();
console.log(currentTime);
currentTimeContainer.innerHTML=`${currentTime.toDateString()}`;
