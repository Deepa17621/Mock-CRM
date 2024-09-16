import dao from "/controller/dao";
let url=window.location.search;
let param=new URLSearchParams(url);
let currentId=param.get("id");
let accountId ;
let dealsArr;


let contactInstance=new dao(`http://localhost:3000/contacts/`);
let currentContactObj=contactInstance.getById(currentId).then((data)=>{
    console.log(data);
    
})
// console.log(currentContactObj);

async function getData()
{
    let url="http://localhost:3000/contacts/";
    let res=await fetch(url+currentId);
    
    let obj=await res.json();
    accountId=obj["OrganizationId"];
    dealsArr=obj["deals"];
    console.log(obj['deals']);
    console.log(dealsArr);
    createTable(obj);
    listDownDeals();
}


let email;
function createTable(data)
{
    let name=document.getElementById("name");
    name.innerHTML=data["Contact Name"];
    let tbl=document.querySelector("#view");
    for (const key in data) 
    {
        if(key=="Contact Mail") {
            email=data[key];
            let tr=document.createElement("tr");
            tbl.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
            td1.textContent=key;
            td2.innerHTML=`<span><a href="mailto:${data[key]}" class="maill">${data[key]}</a></span>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        if(key==="Phone")
        {
            let tr=document.createElement("tr");
            tbl.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
            td1.textContent=key;
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
        let td2=document.createElement("td");
        td2.textContent=data[key];
        row.appendChild(td2);
    }
}
// 1. Flow-1
getData();

// Send Mail Button Event
let mailBtn=document.querySelector("#mailBtn");
mailBtn.addEventListener("click",()=>{
    mailBtn.children[0].href=`mailto:${email}`;
});

// Delete Contact
async function  delContact(id)
{
    let res=await fetch(`http://localhost:3000/contacts/${currentId}`, {
        method:"DELETE"
    });
    let out=res.json();
}

// Update Account Details By Deleting THE Contact id from associated account.
async function updateOrganizationDetails(contactId) {    
    let contactRes=await fetch(`http://localhost:3000/contacts/${contactId}`);
    let contactObj=await contactRes.json();
    let orgID =contactObj.OrganizationId;  
    accountId = orgID;
    if(!accountId){
        return;
    }
    
    // Fetch to get organization Details.
    let orgRes=await fetch(`http://localhost:3000/accounts/${accountId}`);
    let orgObj=await orgRes.json();
    let contactArr=(orgObj["Contacts"]).filter((e)=>{
        e!=contactId;
    });
    orgObj["Contacts"]=contactArr;

    // Fetch To PUT operation in Organization
    let putRes =await fetch(`http://localhost:3000/accounts/${accountId}`, {
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
    await updateOrganizationDetails(currentId);
    await delContact(currentId);
    window.location.href="contact/contactList.html";
    e.stopPropagation();
});

//Edit Contact
let editBtn=document.querySelector("#editBtn");
editBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`http://127.0.0.1:5500/contact/editContact.html?id=${currentId}`;
});


// Create New Deal 
let dealBtn=document.querySelector("#convert");// create new deal button 
dealBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`http://127.0.0.1:5500/deal/createDealForm.html?contactid=${currentId}&accId=${accountId}`;

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

        // Parse the JSON response
        const responseBody = await response.json();
        console.log(responseBody);

    } catch (error) {
        // Handle errors
        console.error("Error:", error);
    }
});


// 2. Cancel Meeting  

