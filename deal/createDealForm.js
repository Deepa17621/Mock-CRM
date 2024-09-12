// const { Double } = require("mongodb");

let url=window.location.search;
let param=new URLSearchParams(url);

// FROM ACCOUNT MODULE---Acc Id
let accIdFromAccModule=param.get("id");
console.log(accIdFromAccModule);


// Getting URL --> If deal creation handled by contact
let contactId=param.get("contactid");
let accountId=param.get("accId");

let fetchedContact;
let fetchedAccount;
// Step-1 ==>If Deal Creation done by Contact Module....
if(contactId!=null  && accountId!=null)
{
    console.log("ContactId="+contactId);
    console.log("AccountId="+accountId);
    getContact(contactId, accountId); // Line Number - 28
}
else if(accIdFromAccModule){
    console.log("THIS DEAL IS CREATE BY ACCOUNT");
    getOrgDetail(accIdFromAccModule);
}
else if(!contactId && !accountId && !accIdFromAccModule)
{
    setDataToFormFields("Dummy", "Dummy");
}


// Fetch Contact & Account Details
async function getContact(cId, aId)  // LIne Number 19
{
    let contactObjs = [];
    let accObj=await fetchAccById(aId);
    try {
        // Check if cId is an array
        if (Array.isArray(cId)) {
            let contactRes = await fetch(`http://localhost:3000/contacts`);
            let contactObj = await contactRes.json();

            // Iterate over cId array
            for (let e of cId) {
                // Iterate over contactObj array
                for (let obj of contactObj) {
                    if (e === obj.id) {
                        contactObjs.push(obj);
                        break; 
                    }
                }
            }
            setDataToFormFields("dummy",accObj);
            return;
        }
        let conById=fetchContById(cId);
        // Assuming setDataToFormFields is defined elsewhere
        setDataToFormFields(conById, accObj);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// If Deal Creation Done By Account Module
async function getOrgDetail(accId) {

    let accObj=await fetchAccById(accId);
    getContact(accObj.Contacts, accId);
}
let myForm=document.querySelector("form");

// save and saveNew
let clicked=null;



// Form Fields
let dealOwner=document.querySelector("#dealOwner");
let dealName=document.querySelector("#dealName");
let contactName=document.querySelector("#contactName");
let accountName=document.querySelector("#accountName");
let amount=document.querySelector("#amount");
let closingDate=document.querySelector("#closingDate");
let stages=null;

let stage=document.querySelector("#stages");
stage.addEventListener("change",()=>{
    stages = stage.value;
    console.log(stages);
    
})

// LookUp Field List
const contsList=document.querySelector("#listOfContacts");
const accList=document.querySelector("#listOfAccs");


 
// Setting predefined values of existing account and contact
async function setDataToFormFields(cObj, aObj)
{
    if(cObj && aObj ==="Dummy")
    {
        let allContacts=await fetchAllContacts();
        let allAccounts=await fetchALLAccounts();
        allContacts.forEach(obj => {
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id} onclick="dataClicked(this.id)">${obj["Contact Name"]}</li>`;
            contsList.appendChild(lii);
        });
        allAccounts.forEach(obj=>{
            let lii=document.createElement("li")
            lii.innerHTML=`<li id=${obj.id} onclick="dataClicked(this.id)>${obj.AccountName}</li>`;
            accList.appendChild(lii);
        })
    }
    else if(cObj!=="dummy" )
    {
        contactName.value=cObj["Contact Name"];
        contactName.setAttribute("disabled", "true");
    }
    else if(aObj!=="Dummy")
    {
        accountName.setAttribute("disabled", "true");
        accountName.value=aObj["AccountName"];
    }
    
}

// Click Function to set Data to Input Field by Clicking the LookUp
function dataClicked(inpTag, id)
{
    
}

// Form Submit Event
myForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    if(!dealOwner.value || !dealName.value || !contactName.value || !amount.value)
    {
        !dealName.value?setError(dealName):setSuccess(dealName);
        !dealOwner.value?setError(dealOwner):setSuccess(dealOwner);
        !contactName.value?setError(contactName):setSuccess(contactName);
        !amount.value?setError(amount):setSuccess(amount);
        return;
    }
    let obj={
        "DealOwner":dealOwner.value,
        "DealName":dealName.value,
        "ContactName":contactName.value,
        "AccountName":accountName.value,
        "Amount":amount.value,
        "ClosingDate":closingDate.value,
        "Stage":stages,
        "ContactId":"",
        "AccountId":""
    }
    if(contactId!=null || accountId!=null)
    {
        obj["ContactId"]=contactId;
        obj["AccountId"]=accountId;
    }
    saveDeal(obj);
    // window.location.href=clicked?`http://127.0.0.1:5500/deal/dealList.html`:"http://127.0.0.1:5500/deal/createDealForm.html";
});
//Update Contact and Account by adding deal details.
async function updateContactAccount(dealObj, cId, aId)
{
    try {
        //fetch contact- to update deal details to contact
        let contactToBeUpdated= await fetchContById(cId);
        contactToBeUpdated["deals"].push(dealObj["id"]);

        // fetch account to update  the deal details
        let accountToBeUpdated=await fetchAccById(aId);
        accountToBeUpdated["deals"].push(dealObj["id"]);

        // put method for contact
        let putContact=await fetch(`http://localhost:3000/contacts/${cId}`, {
        method:"PUT", 
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(contactToBeUpdated)
         });

         let updatedCotact=await putContact.json();

         // put method for account
         let putAccount=await fetch(`http://localhost:3000/contacts/${aId}`,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(accountToBeUpdated)
         });
         let updatedAccount=await putAccount.json();
    } catch (error) {
        console.log(error)
    }
    

}

// POST Method For Deal Creation- Save Deal Data
async function saveDeal(obj)
{
    let res=await fetch("http://localhost:3000/deals", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(obj)
    });
    let out=await res.json();
    updateContactAccount(out, contactId, accountId);
    return out;
}

// ===========> DAO <============
// FETCH TO GET THE ACCOUNT DETAILS By ID
async function fetchAccById(aId) {
    try {
        let accResponse=await fetch(`http://localhost:3000/accounts/${aId}`);
        if(!accResponse.status==200)
        {
           throw new Error("Error Occured: "+ accResponse.statusText);
        }
        let accObj=await accResponse.json();
        return accObj;
    } catch (error) {
        throw new Error("Error: "+ error);
    }
}

// Fetch to get Contact Details By Id
async function fetchContById(conId) {
    try {
        let res=await fetch(`http://localhost:3000/accounts/${conId}`);
        if(!res.status==200)
        {
            throw new Error("Error in Fetching Data---"+ res.status + res.statusText);
        }
        let contactObj=await res.json();
        return contactObj;
    } catch (error) {
        throw new Error("Error: "+ error);
    }
}

// Fetch All Contacts And Accounts
async function fetchAllContacts() {
    try {
        let res=await fetch(`http://localhost:3000/contacts`);
    if(!res.ok)
    {
        throw new Error("Error in Fetching Data");
    }
    let arr=await res.json();
    return arr;
    } catch (error) {
        console.log("error"+error);
        
    }
}

// Fetch All Accounts 
async function  fetchALLAccounts() {
    try {
        let res=await fetch(`http://localhost:3000/accounts`);
    if(!res.ok)
    {
        throw new Error("Error in Fetching Data");
    }
    let arr=await res.json();
    return arr;
    } catch (error) {
        
    }
}

// 1. Cancel Button
let cancelBtn=document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`http://127.0.0.1:5500/deal/dealList.html`;
});

// 2. Save Button
let saveBtn=document.querySelector("#leadSubmitBtn");
saveBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    clicked=1;
    myForm.requestSubmit();
});

// 3. Save and New Button
let saveNewBtn=document.querySelector("#saveNewBtn");
saveNewBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    clicked=0;
    myForm.requestSubmit();
});

// Click Event For LookUp View
let lookUpForContact=document.querySelector("#lookUpForContact");
contactName.addEventListener("click", (e)=>{
    e.preventDefault();
    lookUpForContact.style.display="block";
});

// Form Validation
function setError(tag)
{
    if(!tag.value)
    {
        tag.style.borderColor="red";
        tag.nextElementSibling.textContent="Required...."
        tag.nextElementSibling.style.color="red";
    }
    else setSuccess(tag);
}
function setSuccess(tag)
{
    tag.style.borderColor="black";
    tag.nextElementSibling.innerHTML="";
}


