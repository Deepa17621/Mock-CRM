//1. Multiple Participants Input Tag
let ul=document.querySelector("#inpsUL");
let input=document.querySelector("#participants")
let arr=[];
function addTag()
{
    ul.querySelectorAll("li").forEach(li=>{li.remove()})
    arr.slice().reverse().forEach(inp => {
        let li=`<li>${inp} <i class="fa-solid fa-xmark fa-flip-horizontal fa-sm" style="color: #060707;" onclick="remove(this,'${inp}')"></i></li>`
        ul.insertAdjacentHTML("afterbegin", li)
    });
}
// Remove input By Clicking xmark
function remove(ele,inpFromArr)
{
    let index=arr.indexOf(inpFromArr);
    arr=[...arr.slice(0,index), ...arr.slice(index+1)];    
    ele.parentElement.remove();  
    console.log(arr);
      
}
function addInput(e)
{
    if(e.key=="Enter"){
        let inp=e.target.value.replace(/\s+/g,' ');
        if(inp.length>1 && !arr.includes(inp)){
            if(inp.match( /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
                inp.split(',').forEach(inp => {
                    arr.push(inp);
                    addTag();
                    console.log(arr);
                });
            }
            else{
                alert("Invalid Email!")
            }
        }
        e.target.value="";
    }
    
}
input.addEventListener("keyup", addInput);

// i) ===>(Edit Meeting)
let url=window.location.search;
let param=new URLSearchParams(url);
const meetingKeyForEdit=param.get("meetingToBeEdited");
    //Get Meeting Details
    async function getMeetingDetailToEdit(meetingKeyForEdit) {
        try {
            let res=await fetch(`/getmeeting/${meetingKeyForEdit}`);
            let existingMeetingObj=await res.json();
            if(!res.ok){
                throw new Error("Error: "+res.status+" "+res.statusText);
            }
            console.log("Existing Obj: "+existingMeetingObj);
            setToFormFields(existingMeetingObj.session);
        } catch (error) {
            
        }
    }

//2. Calendar - Date Format
flatpickr(".datePicker",{
    dateFormat: "M j, Y h:i K"
});
//3. Get All the inputs to create Meeting
let topic=document.querySelector("#topic");
let timeZone=document.querySelector("#timeZone");
let agenda=document.querySelector("#agendaForForm");
let startTime=document.querySelector("#startTime");
let endTime=document.querySelector("#endTime");
let host="60030981356"; 
// document.querySelector("#hostInForm");
let participants=arr.map(email=>(JSON.stringify({email})));
console.log(participants);

//5.Buttons For Submition and cancel
let submitBtn=document.querySelector("#submitBtn");
let cancelBtn=document.querySelector("#cancelSubmit");
let myForm=document.querySelector("#form");

// ii)

//6. form submission event
submitBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    myForm.requestSubmit();
});

// 7.cancel Submission of Form
cancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.back();
});

//8. Onload event - clear input fields
window.onload = function() {
    myForm.reset();
};

myForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    //Check Valid Inputs or not
    !startTime.value?setError(startTime):dateTimeValidation(startTime);
    !topic.value?setError(topic):setSuccess(topic);
    endTime.value?dateTimeValidation(endTime):"";

    //Request Body
    const session={
        "session":{
            "topic": topic.value,
            "agenda": agenda.value,
            "presenter":host,
            "startTime": startTime.value,
            "timezone": "Asia/Calcutta",
            "endTime":endTime.value,
            "participants":participants
        }
    };

    try {
        const response = await fetch('/postmeeting', {
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
        let newMeetingResStoredInJson=await fetch(`http://localhost:3000/meetings`, 
            {
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(responseBody.session)
            }
        );
        if(!newMeetingResStoredInJson.ok)
        {
            throw new Error("Meeting Data Not Stored In Json File");
        }
        window.location.href=`../meetings/displayMeetingDetail.html?meetingKey=${responseBody.session.meetingKey}`
        alert("Meeting Created SuccessFully");
        console.log(responseBody);
    } catch (error) {
        console.error("Error:", error);
    }
});

// 4.Validate User Inputs
function dateTimeValidation(tag)
{
    let date=new Date(tag.value);
    if((date.getTime())>=(Date.now())){
        setSuccess(tag);
        tag.nextElementSibling.innerHTML="";
    }
    else{
        setError(tag);
        tag.nextElementSibling.innerHTML="Date and Time cannot be a past time";
        tag.nextElementSibling.style.color="red";
        tag.nextElementSibling.style.fontSize="13px"
    }
}
function setSuccess(tag)
{
    tag.style.border="1px solid green";
}
function setError(tag)
{
    tag.style.border="1px solid red";
    tag.style.borderRadius="2px"
}


