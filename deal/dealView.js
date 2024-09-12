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

    window.location.href=`http://127.0.0.1:5500/deal/dealList.html`;
    
});

async function deleteDeal(id) 
{

    let response=await fetch(`http://localhost:3000/deals/${id}`, {
        method:"DELETE"
    });

}

// back Button for previous page
let backButton=document.querySelector("#backBtn");
backButton.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.back();
});

// put contact Detail By Deleting Deal Id From Contact 
// put account Detail by Deleting Deal Id From Account Details

async function putContactAndAccountDetails(accId,contId) {
    // let cRes=await fetch(`http://localhost:3000/deals/${}`);
    let conToBePut=await cRes.json();
}


