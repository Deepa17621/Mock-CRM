import dao from "../controller/dao.js";
let url=window.location.search;
let param=new URLSearchParams(url);

let currentId=param.get("id");
console.log(currentId);

// Get Table
let table=document.querySelector("table");

// Fetch Current Data From JSON
async function fetchData(id)
{
    let result=await fetch(`http://localhost:3000/deals/${id}`);
    let out=await result.json();
    display(out);    
}
fetchData(currentId);

let contactId;
let accountId;
function display(obj)
{
    contactId=obj["ContactId"];
    accountId=obj["AccountId"];
    console.log(contactId);
    console.log(accountId);
    let name=document.querySelector("#name");
    name.innerHTML=obj["DealName"];
    for (const key in obj)
    {
        if(key=="ContactId" || key=="AccountId")
        {
            let cHead=["id", "Contact Name", "Contact Mail", "Organization"];
            let aHead=["id", "AccountName", "AccountMail", "Phone"];
            let contactTable=document.querySelector("#contactInDeal");
            let accountTable=document.querySelector("#accountInDeal");

            // let header1=document.createElement("tr");
            // contactTable.appendChild(header1);
            // accountTable.appendChild(header1);
            // cHead.forEach(e=>{
            //     let th=document.createElement("th");
            //     th.innerHTML=e;
            //     header1.appendChild(th);
            // });
            // aHead.forEach(e=>{
            //     let th=document.createElement("th");
            //     th.innerHTML=e;
            //     header1.appendChild(th);
            // });
            continue
        }
        let tr=document.createElement("tr");
        table.appendChild(tr);
        let td1=document.createElement("td");
        let td2=document.createElement("td");
        tr.appendChild(td1);
        tr.appendChild(td2);
        td1.innerHTML=key;
        td2.innerHTML=obj[key];

    }
}

// Delete Button
let deleteBtn=document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    deleteDeal(currentId);

    // window.location.href=`../deal/dealList.html`;
    
});

async function deleteDeal(id) 
{
    let confirmation=confirm("are you sure? Deleting Deal!");
    if(confirmation)
    {
        try {
            let updateContAcc=await updateContactAndAccount(id);
            // return 
            if(updateContAcc=="true")
            {
                let response=await fetch(`http://localhost:3000/deals/${id}`, {
                    method:"DELETE"
                });
                if(!response.ok)
                {
                    throw new Error("Error in URL");
                }
                alert("Successfully Deleted!");
            }
        } catch (error) {
            
        }
    }
}

// back Button for previous page
let backButton=document.querySelector("#backBtn");
backButton.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.back();
});

// Edit Deal Details
let editBtn=document.querySelector("#editBtn");
editBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`../deal/createDealForm.html?dealToBeEdited=${currentId}`;
});

// Update Contact And Account Details By Deleting the deal id From both the modules
async function updateContactAndAccount(dealId) {
    try {
        console.log("Function");
        
        let dealInstance=await dao(`http://localhost:3000/deals`);    
        let contactInstance=dao(`http://localhost:3000/contacts`);
        let accountInstance=dao(`http://localhost:3000/accounts`);
        //1.GetDeal Object to get acc and contact Details
        let currentDeal=dealInstance.getById(dealId);        
        if(currentDeal!=null)
        {
             
        }
    } catch (error) {
        
    }
    
}

async function putContactAndAccountDetails(accId,contId) {
    // let cRes=await fetch(`http://localhost:3000/deals/${}`);
    let conToBePut=await cRes.json();
}


