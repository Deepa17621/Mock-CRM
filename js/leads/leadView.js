let url=window.location.search;
console.log(url);
let param=new URLSearchParams(url);
let identity=param.get("id");
let organizationName;

// This is For Display the Clicked Lead Detail
function displayData(obj)
{    
    let mail=null, name=null;
    console.log(obj);
    
    let table=document.querySelector("#view");
    for (const key in obj)
    {
        if(key=="email" || key=="phone")
        {
            mail=obj[key];
            let tr=document.createElement("tr");
            table.appendChild(tr);
            let td1=document.createElement("td");
            td1.classList.add("key");
            let td2=document.createElement("td");
            td1.textContent=key;
            td2.innerHTML=(key=="email")?`<a href="mailto:${obj[key]}">${obj[key]}</a>`:`<a href="tel:${obj[key]}">${obj[key]}</a>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        if(key=="firstName")
        {
            name=obj[key];
        }
        
        let tr=document.createElement("tr");
        table.appendChild(tr);
        let td1=document.createElement("td");
        let td2=document.createElement("td");
        td1.textContent=key;
        td1.classList.add("key")
        td2.textContent=(obj[key]);
        tr.appendChild(td1);
        tr.appendChild(td2);
    }
    let mailBtn=document.getElementById("mail");
    mailBtn.setAttribute("href", `mailto:${mail}`);
    document.getElementById("name").innerHTML=`${name}`;
}

async function currentLead(identity) {
    try {
        let res=await fetch(`/mongodb/getById/leads/${identity}`);
        let leadObj=await res.json();
        if(!res.ok){
            throw new Error("Error:"+res.status+" "+res.statusText);
        }
        organizationName=leadObj["organization"];
        displayData(leadObj);
        
    } catch (error) {
        console.log(error);
    }
}

currentLead(identity); // Actual Execution starts Here...

// Edit Button- Click to Edit the Lead Details
let editBtn=document.getElementById("editBtn");
console.log(editBtn);

editBtn.addEventListener("click", (event)=>{
    event.preventDefault();
    window.location.href=`/html/leads/editLeadForm.html?id=${identity}`;
});


// Convert Lead To Other Modules Event
let convertBtn=document.querySelector("#convert");

convertBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    document.querySelector(".popup-container").style.display="flex";
    e.stopPropagation();
});

// Cancel From Pop-Up
let cancelPopup=document.querySelector("#popupCancel");
    cancelPopup.addEventListener("click", (e)=>{
        e.preventDefault();
        document.querySelector(".popup-container").style.display="none";
    });

//convertForm
let convertForm=document.querySelector("form");

function submit1()
{
    let options=document.getElementsByName("options");
    let selected='';
    for (const e of options) 
    {
            if(e.checked)
            {
                selected=e.value;
                break;
            }
    }
    if(selected=="ContactOnly")
    {
        convertForm.requestSubmit();
    }
    else if(selected=="hasAccount")
    {
        
        fetchAccount(organizationName);
        convertForm.requestSubmit();
    }
    else if(selected=="CreateAccount")
    {
        window.location.href= `/html/accounts/createAccount.html?id=${identity}`;
    }
    
}

//=======================

// Fetch Account Details using Account NAME //ERROR-1
async function fetchAccount(name)
{
    let accName=await fetch(`/mongodb/getById/accounts?AccountName=${name}`);
    let res=await accName.json();
    if(!accName.ok)
    {
        throw new Error("Error From Acc Fetch")
    }
    let objectt=res[0];
    console.log(objectt);

    objectt["Contacts"].push(identity);
    putAcc(objectt, objectt["_id"]);
}

// Update Account Details By Adding Lead Id To Account
async function putAcc(obj,accId)
{
    let res=await fetch(`/mongodb/update/accounts/${accId}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(obj)
    });
    let out=await res.json();
    console.log(out);
}


convertForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    // let contactOnly=document.querySelector("#contactOnly");
    document.querySelector(".popup-container").style.display="none";
    window.location.href=`/html/contacts/contactList.html?id=${identity}`;
});

async function deleteLead(id)
{
        try {
            let res=await fetch(`/mongodb/delete/leads/${id}`, {
                method:"DELETE"
            });
            let out=res.json();
            if(!res.ok){
                throw new Error("Error: "+ res.status+ " "+res.statusText);
            }
            alert("Lead Deleted!");
        } catch (error) {
            
        }
}

let deleteBtn=document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    if(confirm("Are you sure? To delete lead.")){
        deleteLead(identity);
        window.location.href=`/html/leads/leadList.html`;
    }
    e.stopPropagation();
});

// back to previous page event
let back=document.querySelector("#backBtn");
back.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href = `/html/leads/leadList.html`;
})