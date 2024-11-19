// const { Double } = require("mongodb");
let url = window.location.search;
let param = new URLSearchParams(url);
let currentId = param.get("id");
console.log(currentId);

let mailButton;
let accTable = document.getElementById("accTable");
let contactTable = document.getElementById("contactsInAcc");
let dealTable = document.querySelector("#dealsInAcc");
let headArrForContact = ["contactName", "contactMail", "phone"];
let headArrForDeals = ["dealName", "id", "amount", "stage", "closingDate"];

function displayAcc(obj){
    for (const key in obj) {

        if(key =="contacts"|| key == "deals")
        {
            if(key == "contacts")
            {
                let thead = document.createElement("tr");
                contactTable.appendChild(thead);
                let td1 = document.createElement("th");
                thead.appendChild(td1);
                td1.innerHTML = "Contact Name";
                let td2 = document.createElement("th");
                thead.appendChild(td2);
                td2.innerHTML = "Contact Mail";
                let td3 = document.createElement("th");
                thead.appendChild(td3);
                td3.innerHTML = "Contact Phone";
                obj["contacts"].forEach(contactId => {
                    fetchContactToAcc(contactId, headArrForContact); 
                });
            }
            else if(key == "deals")
            {
                let thead = document.createElement("tr");
                dealTable.appendChild(thead);
                let td1 = document.createElement("th");
                thead.appendChild(td1);
                td1.innerHTML = "dealName";
                let td2 = document.createElement("th");
                thead.appendChild(td2);
                td2.innerHTML = "id";
                let td3 = document.createElement("th");
                thead.appendChild(td3);
                td3.innerHTML = "amount";
                let td4 = document.createElement("th");
                thead.appendChild(td4);
                td4.innerHTML = "stage";
                let td5 = document.createElement("th");
                thead.appendChild(td5);
                td5.innerHTML = "closingDate";
                obj["deals"].forEach(accId => {
                    fetchDealToAcc(accId,headArrForDeals); 
                });
            }
        }
        else {
            let tr = document.createElement("tr");
            accTable.appendChild(tr);
            let td1 = document.createElement("td");
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            tr.appendChild(td2);
            td1.innerHTML = key.toUpperCase();
            if(key == "accountMail")
            {
                mailButton = obj[key];
                td2.innerHTML = `<a href="mailto:${obj[key]}">${obj[key]}</a>`;
                continue
            }
            else if(key == "phone")
            {
                td2.innerHTML = `<a href="tel:${obj[key]}">${obj[key]}</a>`;
                continue
            }
            td2.innerHTML=obj[key];
        }
    }
}
// Fetch Account Data From JSON
async function fetchAcc(id)
{
    let res=await fetch(`/mongodb/getById/accounts/${currentId}`); 
    let out=await res.json();
    displayAcc(out); 
}

fetchAcc(currentId);

function rowClicked(id)
{
    window.location.href=`/html/contacts/contactView.html?id=${id}`;
}

// Fetch Contact Details To Accounts Module
async function fetchContactToAcc(id, arr)
{
    try {
        let res = await fetch(`/mongodb/getById/contacts/${id}`);
        let out = await res.json();
        if(res.ok)
        {
            let iterator = arr[Symbol.iterator]();
            let trr = document.createElement("tr");
            contactTable.appendChild(trr);
            trr.setAttribute("id", id);
            trr.setAttribute("onclick", "rowClicked(this.id)");
            for (const key in out)
            {
                    let val = iterator.next().value;
                    let td = document.createElement("td");
                    trr.appendChild(td);
                    td.className = val;
                    td.textContent = out[td.className];
            }
        }
        else{
            throw new Error("Contact Not Found");
        }
    } catch (error) {
        throw new Error("Contact Not Found");
    }
}

// Fetch Deal Details to Accounts Module
async function fetchDealToAcc(id, arr)
{
    try {
        let res = await fetch(`/mongodb/getById/deals/${id}`);
        let out = await res.json();
        if(res.ok)
        {
            console.log("Deals From Accounts Module");
        
            console.log(out);
            let iterator = arr[Symbol.iterator]();
            let trr = document.createElement("tr");
            dealTable.appendChild(trr);
            trr.setAttribute("id", id);
            trr.addEventListener("click", (e)=>{
                e.preventDefault();
                window.location.href = `/html/deals/dealView.html?id=${id}`
            })
            for (const key in out)
            {
                    let val = iterator.next().value;
                    console.log(val); 
                    let td = document.createElement("td");
                    trr.appendChild(td);
                    td.className = val;
                    td.textContent = out[td.className];
            }
        }
        else{
            throw new Error("Deal Not Found");
        }
    } catch (error) {
        throw new Error("Deal Not Found");
    }
}

// Edit Button Event
let editBtn = document.querySelector("#editBtn");

editBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href = `/html/accounts/editAccount.html?id=${currentId}`;
});

// Delete Btn Event
let deleteBtn = document.querySelector("#deleteBtn");

deleteBtn.addEventListener("click", async(e)=>{
    e.preventDefault();
    if(window.confirm("Are You Sure delete??")){
        // Before Deleting Account...we need to delete the account associated with Contact.
        // Updating Contact By deleting the account ID in Contact Detail.
        await updateContactFromAccount(currentId); // Here Current Id Refers Account ID of Viewed Account.
        // Deletion of Account.
        await deleteAcc(currentId);
        window.alert("Account Deleted Successfully")
        window.location.href = `/html/accounts/accountList.html`;
    }
    e.stopPropagation();
});
// Update Contact Function
async function updateContactFromAccount(accId) {
    let allContacts=await fetch(`/mongodb/getAll/contacts`);
    if(allContacts.ok){
        let objs=await allContacts.json();
        objs.forEach(element => {
            if(element.organizationId == accId){
                fetchAndUpdateContact(element._id)
            }
        });
    }

}

async function  fetchAndUpdateContact(contactId) {
    let conRes = await fetch(`/mongodb/getById/contacts/${contactId}`);
    let conObj = await conRes.json();
    conObj["organizationId"] = "";
    conObj["organization"] = "";
    delete conObj._id;

    // Update contact --PUT Method
    let putContact = await fetch(`/mongodb/update/contacts/${contactId}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(conObj)
    });
}

async function deleteAcc(id)
{
    let res=await fetch(`/mongodb/delete/accounts/${id}`,{
        method:"DELETE", 
        headers:{"Content-Type":"application/json"}
    });
    let out=await res.json(); 
    return out;
}

// send Mail Button
let mailBtn = document.querySelector("#mailBtn");
mailBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    // mailBtn.setAttribute("href", `mailto:${mailButton}`);
    mailBtn.children[0].href=`mailto:${mailButton}`;
});

// back button to navigate previously visted page
let backBtn = document.querySelector("#backBtn");
backBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.go(-1);
});

// Create Deal For Specified Account Along With Contact Detail.
let createDealFromAccount = document.querySelector("#convert");
createDealFromAccount.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/html/deals/createDealForm.html?id=${currentId}`; // Here current id refers Current Viewed Account s
})