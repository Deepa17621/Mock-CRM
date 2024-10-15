let url=window.location.search;
let param=new URLSearchParams(url);

// Deal Creation From Account Module-->Redirection From Account View
let accIdFromAccModule=param.get("id");
console.log(accIdFromAccModule);

// Editing Deal Details--> Redirection from dealView
let dealToBeEdited=param.get("dealToBeEdited");
if(dealToBeEdited!=null)
{
    let setTitle=document.querySelector("#titleForPage");
    setTitle.textContent="Edit Deal"
}
// Deal Creation From Contact Module-->Redirection From Contact View
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
// Deal Creation from direct Deal Module
else if(!contactId && !accountId && !accIdFromAccModule && !dealToBeEdited)
{
    setDataToFormFields("Dummy", "Dummy");
}
else if(dealToBeEdited)
{
    getDealToBeEdited(dealToBeEdited);
}
// Fetch Contact & Account Details
async function getContact(cId, aId)  // LIne Number 19
{
    let accObj=await fetchAccById(aId);
    try {
        // Check if cId is an array
        if (Array.isArray(cId)) {
            setDataToFormFields(cId,accObj);
            return;
        }
        let conById=await fetchContById(cId);
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

// Edit Deal Details 
async function getDealToBeEdited(id) {
    let dealObj=await fetchDealById(id);
    console.log(dealObj);
    setDealDataToForm(dealObj);

}
let myForm=document.querySelector("form");

// save and saveNew
let clicked=null;



// Form Fields
let dealOwner=document.querySelector("#dealOwner");
let dealName=document.querySelector("#dealName");
let contactName=document.querySelector("#contactName");
let accountName=document.querySelector("#accountName");
let dateOfDealCreation=document.querySelector("#dateOf");
let amount=document.querySelector("#amount");
let closingDate=document.querySelector("#closingDate");
let pipeLineInp=document.querySelector("#pipeLine");
let stage=document.querySelector("#stages");
let designation=document.querySelector("#designation");

let stages=null;
stage.addEventListener("change",()=>{
    stages = stage.value;
    console.log(stages);
    
})

// LookUp Field List
const contsList=document.querySelector("#listOfContacts");
const accList=document.querySelector("#listOfAccs");
// Dynamic stages based on user choice
let deepaPipeLine=`<option value="">--select--</option>
                      <option value="stage1">stage1</option>
                      <option value="stage2">stage2</option>
                      <option value="stage3">stage3</option>
                      <option value="stage4">stage4</option>
                      <option value="stage5">stage5</option>`;

let standardPipeLine=`<option value="">select</option>
                      <option value="qualification">Qualification</option>
                      <option value="needAnalysis">Need Analysis</option>
                      <option value="valueProposition">Value Proposition</option>
                      <option value="identifyDecisionMakers">Identify Decision Makers</option>
                      <option value="proposal">Proposal / Price Quote</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closedWon">Closed Won</option>
                      <option value="closedLost">Closed Lost</option>
                      <option value="closedLostCompetition">Closed-Lost Competition</option>`;
 
// Setting predefined values of existing account and contact
async function setDataToFormFields(cObj, aObj)
{
    if(cObj && aObj ==="Dummy")
    {
        let allContacts=await fetchAllContacts();
        let allAccounts=await fetchALLAccounts();
        allContacts.forEach(obj => {
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["Contact Name"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                contactName.id=obj.id;
                contactName.value=obj["Contact Name"];    
                lookUpForContact.style.display="none";
            });
            contsList.appendChild(lii);
        });
        allAccounts.forEach(obj=>{
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["AccountName"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                accountName.id=obj.id;
                accountName.value=obj.AccountName;
                lookUpForAccount.style.display="none";
            })
            accList.appendChild(lii);
        })
    }
    else if(Array.isArray(cObj) ) // Here cObj Refers Contact Array From Account
    {
        cObj.forEach(async(id)=> {
            let obj=await fetchContById(id);
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["Contact Name"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                contactName.id=obj.id;
                contactName.value=obj["Contact Name"];    
                lookUpForContact.style.display="none";
            });
            contsList.appendChild(lii);
        });
        accountName.setAttribute("disabled", "true");
        accountName.value=aObj["AccountName"];
    }
    else if(aObj!=="Dummy")
    {
        contactName.value=cObj["Contact Name"];
        contactName.setAttribute("disabled", "true");
        accountName.setAttribute("disabled", "true");
        accountName.value=aObj["AccountName"];
    }
    
}
// Default selection 
let pipeLineChoice=document.querySelector("#pipeLine");
if(pipeLineChoice.value=="standard")
{
    stage.innerHTML=standardPipeLine;
}
else if(pipeLineChoice.value=="deepa")
{
    stage.innerHTML=deepaPipeLine;
}
// Set Stage options - based on url param -Deal Creation From kambanView
if((param.get("pipeLine")=="deepa"))
{
    pipeLineChoice.value="deepa";
    stage.innerHTML=deepaPipeLine;
}
else if((param.get("pipeLine"))=="standardView")
{
    pipeLineChoice.value="standard"
    stage.innerHTML=standardPipeLine;
}
// Set Stage Options - based on user choice
pipeLineChoice.addEventListener("change", (e)=>{
    e.preventDefault();
    if(pipeLineChoice.value=="standard")
    {
        stage.innerHTML=standardPipeLine;
    }
    else if(pipeLineChoice.value=="deepa")
    {
        stage.innerHTML=deepaPipeLine;
    }
})
// Form with prefilled Data --- To Edit The Deal
 async function setDealDataToForm(dealObj)
{
    dealName.value=dealObj.DealName;
    dealOwner.value=dealObj.DealOwner;
    contactName.value=dealObj.ContactName;
    contactName.setAttribute("id", dealObj.ContactId);
    accountName.value=dealObj.AccountName;
    accountName.setAttribute("id", dealObj.AccountId);
    dateOfDealCreation.value=dealObj.DateOf;
    amount.value=dealObj.Amount;
    closingDate.value=dealObj.ClosingDate;
    pipeLineInp.value=dealObj.pipeLine;
    if(dealObj.pipeLine=="deepa")
    {
        stage.innerHTML=deepaPipeLine;
        stage.value=dealObj.Stage;
    }
    else if(dealObj.pipeLine=="standard")
    {
        stage.innerHTML=standardPipeLine;
        stage.value=dealObj.Stage;
    }
    setLookUpFields();
}
// LookUp With All the contacts and Accounts
async function setLookUpFields()
{
    let allContacts=await fetchAllContacts();
        let allAccounts=await fetchALLAccounts();
        allContacts.forEach(obj => {
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["Contact Name"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                contactName.id=obj.id;
                contactName.value=obj["Contact Name"];    
                lookUpForContact.style.display="none";
            });
            contsList.appendChild(lii);
        });
        allAccounts.forEach(obj=>{
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["AccountName"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                accountName.id=obj.id;
                accountName.value=obj.AccountName;
                lookUpForAccount.style.display="none";
            })
            accList.appendChild(lii);
        })
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
        "DateOf":dateOfDealCreation.value,
        "Amount":amount.value,
        "ClosingDate":closingDate.value,
        "pipeLine":pipeLineInp.value,
        "Stage":stage.value,
        "ContactId":"",
        "AccountId":""
    }
        obj["ContactId"]=!contactId?contactName.id:contactId;
        obj["AccountId"]=!accountId?(accIdFromAccModule?accIdFromAccModule:accountName.id):accountId;
        let DEAL=!dealToBeEdited?saveDeal(obj):updateDeal(obj);
        // window.location.href=clicked?`../deal/dealList.html`:"../deal/createDealForm.html";
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
         let putAccount=await fetch(`http://localhost:3000/accounts/${aId}`,{
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
    try {
            if(obj.pipeLine=="standard")
            {
                let res=await fetch(`http://localhost:3000/deals/standardPipeLine`, {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(obj)
                });
            }
            else if(obj.pipeLine=="deepa")
            {
                let res=await fetch(`http://localhost:3000/deals/deepaPipeLine`, {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(obj)
                });
            }
       if(res.ok)
       {
        let out=await res.json();
        updateContactAccount(out, out.ContactId, out.AccountId);
        alert("Successfully Deal Created!")
        return out;
       }
       else throw new Error("Error in URL");
    } catch (error) {
        
    }
}
async function updateDeal(obj) {
    try {
        let res=await fetch(`http://localhost:3000/deals/${dealToBeEdited}`, {
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(obj)
        });
       if(res.ok)
       {
            let out=await res.json();
            updateContactAccount(out, out.ContactId, out.AccountId);
            alert("Deal Updated!");
            return out;
       }
       else throw new Error("Error in URL");
    } catch (error) {
        
    }
}

// Flatpicker
flatpickr(".datePicker", {
    // You can add options here
    dateFormat: "M d, Y",
});

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
        let res=await fetch(`http://localhost:3000/contacts/${conId}`);
        if(!res.status==200) {
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
    if(!res.ok){
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
        console.log(error);
    }
}

// Fetch Deal By Id
async function fetchDealById(id) {
    try {
        let res=await fetch(`http://localhost:3000/deals/${id}`);
        if(!res.ok)
        {
            throw new Error("Error in URL");
        }
        let obj=await res.json();
        return obj;
    } catch (error) {
        console.log(error);  
    }
}

// 1. Cancel Button
let cancelBtn=document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    // window.location.href=`/deal/dealList.html`;
    window.history.back();
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

// Click Event For LookUp View - Contact LookUp
let lookUpForContact=document.querySelector("#lookUpForContact");
contactName.addEventListener("focus", (e)=>{
    e.preventDefault();
    lookUpForContact.style.display="block";
});
// contactName.addEventListener("blur", (e)=>{
//     e.preventDefault();
//     lookUpForContact.style.display="none";
// });
// Click Event For LookUp View - Account LookUp
let lookUpForAccount=document.querySelector("#lookUpForAcc");
accountName.addEventListener("focus", (e)=>{
    e.preventDefault();
    lookUpForAccount.style.display="block";
})
// accountName.addEventListener("blur", (e)=>{
//     e.preventDefault();
//     lookUpForAccount.style.display="none";
// })
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


