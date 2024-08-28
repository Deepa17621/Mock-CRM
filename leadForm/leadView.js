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
        if(key=="Lead Mail" || key=="Phone")
        {
            mail=obj[key];
            let tr=document.createElement("tr");
            table.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
            td1.textContent=key;
            td2.innerHTML=(key=="Lead Mail")?`<a href="mailto:${obj[key]}">${obj[key]}</a>`:`<a href="tel:${obj[key]}">${obj[key]}</a>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        if(key=="Lead Name")
        {
            name=obj[key];
        }
        
        let tr=document.createElement("tr");
        table.appendChild(tr);
        let td1=document.createElement("td");
        let td2=document.createElement("td");
        td1.textContent=key;
        td2.textContent=obj[key];
        tr.appendChild(td1);
        tr.appendChild(td2);
    }
    let mailBtn=document.getElementById("mail");
    mailBtn.setAttribute("href", `mailto:${mail}`);
    document.getElementById("name").innerHTML=`${name}`;
}

const clickedDataFetch=async()=>{
    let id=param.get("id");
    console.log(id);
    
    // let url=`http://localhost:3000/leads/`
     const res=await fetch("http://localhost:3000/leads/"+id);
     const data=await res.json();
     organizationName=data["Organization"];
     console.log(organizationName);
     displayData(data);
}

clickedDataFetch();

// Edit Button- Click to Edit the Lead Details
let editBtn=document.getElementById("editBtn");
console.log(editBtn);

editBtn.addEventListener("click", ()=>{
    window.location.href=`http://127.0.0.1:5500/leadForm/editLeadForm.html?id=${identity}`;
   
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
        convertForm.requestSubmit();
        window.location.href=await `http://127.0.0.1:5500/accounts/createAccount.html?id=${identity}`;
    }
    
}

//=======================

// Fetch Account Details using Account NAME
async function fetchAccount(name)
{
    let accName=await fetch(`http://localhost:3000/accounts?AccountName=${name}`);
    let res=await accName.json();
    if(!accName.ok)
    {
        throw new Error("Error From Acc Fetch")
    }
    let objectt=res[0];
    console.log(objectt);

    objectt["Contacts"].push(identity);
    putAcc(objectt, objectt["id"]);

    // let contactFetch=

}

// Update Account Details By Adding Lead Id To Account
async function putAcc(obj,accId)
{
    let res=await fetch(`http://localhost:3000/accounts/${accId}`, {
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
    window.location.href=`http://127.0.0.1:5500/contact/contactList.html?id=${identity}`;
});

async function del(id)
{
        let res=await fetch(`http://localhost:3000/leads/${id}`, {
            method:"DELETE"
        });
        let out=res.json();
}

let deleteBtn=document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    del(identity);
    window.location.href=`http://127.0.0.1:5500/leadForm/leadList.html`;
    e.stopPropagation();
});



// back to previous page event
let back=document.querySelector("#backBtn");
back.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.back();
})