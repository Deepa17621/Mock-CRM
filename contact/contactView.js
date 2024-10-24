let url=window.location.search;
let param=new URLSearchParams(url);
let currentId=param.get("id");

let accountId ;
let dealsArr;

async function getData()
{
    try {
        let res=await fetch(`/getById/contacts/`+currentId);
        let contactObj=await res.json();
        if(!res.ok){
            throw new Error("Error: "+ res.status+ " "+ res.statusText);
        }
            console.log(contactObj);
            
            accountId=contactObj["organizationId"];
            dealsArr=contactObj["deals"];
            console.log(contactObj['deals']);
            console.log(dealsArr);
            createTable(contactObj);
            listDownDeals();
    } catch (error) {
        
    }
}
let email;
function createTable(data)
{
    let name=document.getElementById("name");
    name.innerHTML=data["contactName"];
    let tbl=document.querySelector("#view");
    for (const key in data) 
    {
        let tr=document.createElement("tr");
            tbl.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
        if(key=="contactMail") {
            email=data[key];
            td1.textContent=key.toUpperCase();
            td2.innerHTML=`<span><a href="mailto:${data[key]}" class="maill">${data[key]}</a></span>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        if(key==="phone")
        {
            td1.textContent=key.toUpperCase();
            td2.innerHTML=`<span><a href="tel:${data[key]}">${data[key]}</a></span>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        let row=document.createElement("tr");
        tbl.appendChild(row);
        let td=document.createElement("td");
        td.innerHTML=key.toUpperCase();
        row.appendChild(td);
        let td3=document.createElement("td");
        td3.textContent=data[key];
        row.appendChild(td3);
    }
}
// 1. step-1
getData();

// Send Mail Button Event
let mailBtn=document.querySelector("#mailBtn");
mailBtn.addEventListener("click",()=>{
    mailBtn.children[0].href=`mailto:${email}`;
});

// Delete Contact
async function  delContact(id)
{
    let res=await fetch(`/delete/contacts/${currentId}`, {
        method:"DELETE"
    });
    let out=res.json();
}

// Update Account Details By Deleting THE Contact id from associated account.
async function updateOrganizationDetails(contactId) {    
    try {
        let contactRes=await fetch(`/getById/contacts/${contactId}`);
        if(res.ok){
            let contactObj=await contactRes.json();
            let orgID =contactObj.OrganizationId;  
            accountId = orgID;
            if(!accountId){
                return;
            }
        }
        else throw new Error("Error In getting Contact"+res.status)
    } catch (error) {
        console.log(error);
    }
    
    // Fetch to get organization Details.
    try {
        let orgRes=await fetch(`/getById/accounts/${accountId}`);
        let orgObj=await orgRes.json();
        if(res.ok){
            let contactArr=(orgObj["Contacts"]).filter((e)=>{
                e!=contactId;
            });
            orgObj["Contacts"]=contactArr;
        }
        else throw new Error("Error in fetching account data: "+ res.status);
    } catch (error) {
        console.log(error);
    }

    // Fetch To PUT operation in Organization
    let putRes =await fetch(`/update/accounts/${accountId}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(orgObj)
    });

}
// Click Event For Delete Contact.

// Before Deleting Contact  here we need to delete the contact Details in Account ALSO.
let delBtn=document.querySelector("#deleteBtn");
delBtn.addEventListener("click",async (e)=>{
    e.preventDefault();
    if(confirm("are you sure? delete contact!")){
        await updateOrganizationDetails(currentId);
        await delContact(currentId);
        window.location.href="contact/contactList.html";
        e.stopPropagation();
    }
});

//Edit Contact
let editBtn=document.querySelector("#editBtn");
editBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/contact/editContact.html?id=${currentId}`;
});


// Create New Deal 
let dealBtn=document.querySelector("#convert");// create new deal button 
dealBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/deal/createDealForm.html?contactid=${currentId}&accId=${accountId}`;
});

// List Down Deals Details
let dealTable=document.querySelector("#dealTable");
function listDownDeals()
{
    let thead=document.createElement("tr");

}


// back button event to navigate to previously visited page
let backBtn=document.querySelector("#backBtn");
backBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.back();
})

 // ========================================== Test Meeting =======================================================
// 1. Meeting Creation Event-----> Create Meeting <----------
let dialog=document.querySelector("#dialogbox");
let meetingBtn=document.querySelector("#meetingBtn");
let meetingCancelBtn=document.querySelector("#meetingCancelBtn");
meetingBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    dialog.showModal();
});

// Meeting close event--- dialog box closing event
meetingCancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    dialog.close();
});

// meeting save button
let meetingSaveBtn=document.querySelector("#meetingSaveBtn");

meetingSaveBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    meetingForm.requestSubmit();
});
// Meeting Form Data
let meetingTopic=document.querySelector("#topic");
let mlocation=document.querySelector("#location");
let startTime=document.querySelector("#startTime");
let agenda=document.querySelector("#agenda");
// let endTime=document.querySelector("#endTime");
let presenterId=document.querySelector("#presenterId");
let participants=document.querySelector("#participants");
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
        console.log(responseBody);

    } catch (error) {
        console.error("Error:", error);
    }
});
  

