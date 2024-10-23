let url=window.location.search;
console.log(url);
let param=new URLSearchParams(url);
let identity=param.get("id");
console.log(identity);
let organizationName;
// This is For Display the Clicked Lead Detail
function displayData(obj)
{    
    let mail=null, name=null;
    console.log(obj);
    
    let table=document.querySelector("#view");
    for (const key in obj)
    {
        if(key=="leadMail" || key=="phone")
        {
            mail=obj[key];
            let tr=document.createElement("tr");
            table.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
            td1.textContent=key;
            td2.innerHTML=(key=="leadMail")?`<a href="mailto:${obj[key]}">${obj[key]}</a>`:`<a href="tel:${obj[key]}">${obj[key]}</a>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        if(key=="leadName")
        {
            name=obj[key];
        }
        
        let tr=document.createElement("tr");
        table.appendChild(tr);
        let td1=document.createElement("td");
        let td2=document.createElement("td");
        td1.textContent=key.toUpperCase();
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
        let res=await fetch(`/getById/leads/${identity}`);
        let leadObj=await res.json();
        if(!res.ok){
            // console.log(res.status+ " "+res.statusText);
            
            throw new Error("Error:"+res.status+" "+res.statusText);
        }
        organizationName=leadObj["organization"];
        console.log(leadObj);
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
    window.location.href=`/leadForm/editLeadForm.html?id=${identity}`;
});


// Convert Lead To Other Modules Event
let convertBtn=document.querySelector("#convert");

convertBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    document.querySelector("#popupContainer").style.display="flex";
    e.stopPropagation();
});

// Cancel From Pop-Up
let cancelPopup=document.querySelector("#popupCancel");
    cancelPopup.addEventListener("click", (e)=>{
        e.preventDefault();
        document.querySelector("#popupContainer").style.display="none";
    });

    //convertForm
let convertForm=document.querySelector("form");

function submit1()
{
    let options=document.getElementsByName("options");
    console.log(options);
    
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
        window.location.href= `/accounts/createAccount.html?id=${identity}`;
    }
    
}

//=======================

// Fetch Account Details using Account NAME //ERROR-1
async function fetchAccount(name)
{
    let accName=await fetch(`/getById/accounts?AccountName=${name}`);
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
    let res=await fetch(`/update/accounts/${accId}`, {
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
    document.querySelector("#popupContainer").style.display="none";
    window.location.href=`/contact/contactList.html?id=${identity}`;
});

async function deleteLead(id)
{
        try {
            let res=await fetch(`/delete/leads/${id}`, {
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
        window.location.href=`/leadForm/leadList.html`;
    }
    e.stopPropagation();
});



// back to previous page event
let back=document.querySelector("#backBtn");
back.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.back();
})