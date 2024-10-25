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

const contsList=document.querySelector("#listOfContacts");
const accList=document.querySelector("#listOfAccs");
let listOfPipeLines;

// PipeLine Options
async function getPipeLines() {
    try {
        let res=await fetch(`/getAll/pipeLines`);
        let pipeLinesFromDB=await res.json();
        console.log(pipeLinesFromDB);
        let options="";        
        if(res.ok){
            pipeLinesFromDB.forEach(obj => {
                options+=`<option value='${Object.keys(obj)[1]}'>${Object.keys(obj)[1]}</option>`;
            }); 
            pipeLineInp.innerHTML=options;   
            setInitialStages(pipeLinesFromDB);
        }
    } catch (error) {
        
    }
}
//Initial stages - Dynamic options for pipeLines and stages
function setInitialStages(pipeLines){
    let initialPipeLine=pipeLineInp.value;
    let stageStructure="";
    pipeLines.forEach(element => {
        if(Object.keys(element)[1]==initialPipeLine){
            let initialStages=element[`${initialPipeLine}`];
            let stagesArr=Object.keys(initialStages);
            stagesArr.forEach(stage => {
                stageStructure+=`<option value='${stage}'>${stage}</option>`;
            });
            stage.innerHTML=stageStructure;
            return;
        }
    });
}
getPipeLines();
let pipeLineChoice=document.querySelector("#pipeLine");
// Set Stage Options - based on user choice
pipeLineChoice.addEventListener("change", async(e)=>{
    e.preventDefault();
    try {
        let res=await fetch(`/getAll/pipeLines`);
        let pipeLines=await res.json();
        if(res.ok){           
            let stages="";
            pipeLines.forEach(obj => {
                let currentPipe=Object.keys(obj)[1];
                if(pipeLineChoice.value==currentPipe){
                    for (const key in obj[currentPipe]) {
                        stages+=`<option value="${key}">${key}</option>`;
                    }
                    return;
                }
            });
            stage.innerHTML=stages;
        }
    } catch (error) {
        
    }
});

let fetchedContact;
let fetchedAccount;

// Step-1 ==>If Deal Creation done by Contact Module....
if(contactId!=null ){
    if(accountId!=null){
        console.log("ContactId="+contactId);
        console.log("AccountId="+accountId);
        getContactAndAccount(contactId, accountId);
    } 
    getContactAndAccount(contactId, "Dummy")
}
else if(accIdFromAccModule){
    console.log("THIS DEAL IS CREATE BY ACCOUNT");
    getOrgDetail(accIdFromAccModule);  ///-------------------------------
}
// Deal Creation from direct Deal Module
else if(!contactId && !accountId && !accIdFromAccModule && !dealToBeEdited){
    setDataToFormFields("Dummy", "Dummy");
}
else if(dealToBeEdited){
    getDealToBeEdited(dealToBeEdited);
}

// 1.Fetch Contact & Account Details
async function getContactAndAccount(cId, aId) 
{
    try {
        // Check if cId is an array
        if (Array.isArray(cId)) {
            if(!cId.isEmpty()){
                setDataToFormFields(cId,accObj);
                return;
            }
        }
        let conById=await getById(cId, "contacts");
        if(aId!="Dummy"){
            let accObj=await getById(aId, "accounts");
            setDataToFormFields(conById, accObj);
            return;
        }
        setDataToFormFields(conById, "Dummy");
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// 2. If Deal Creation Done By Account Module
async function getOrgDetail(accId) {
    let accObj=await getById(accId, "accounts");
    setDataToFormFields(accObj.contacts, accObj);
}

// Edit Deal Details 
async function getDealToBeEdited(id) {
    let dealObj=await getById(id, "deals");
    console.log(dealObj);
    setDealDataToForm(dealObj);

}
let myForm=document.querySelector("form");

// save and saveNew
let clicked=null;

let stages=null;
stage.addEventListener("change",()=>{
    stages = stage.value;
    console.log(stages);
    
});
 
// Setting predefined values of existing account and contact
async function setDataToFormFields(cObj, aObj)
{
    if(cObj && aObj ==="Dummy")
    {
        let allContacts=await getAll("contacts");
        let allAccounts=await getAll("accounts");
        allContacts.forEach(obj => {
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["contactName"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                contactName.id=obj._id;
                contactName.value=obj["contactName"];    
                lookUpForContact.style.display="none";
            });
            contsList.appendChild(lii);
        });
        allAccounts.forEach(obj=>{
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["accountName"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                accountName.id=obj._id;
                accountName.value=obj.accountName;
                lookUpForAccount.style.display="none";
            })
            accList.appendChild(lii);
        })
    }
    else if(Array.isArray(cObj) ) // Here cObj Refers Contact Array From Account
    {
        cObj.forEach(async(id)=> {
            let obj=await getById(id, "contacts");
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["contactName"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                contactName.id=obj._id;
                contactName.value=obj["contactName"];    
                lookUpForContact.style.display="none";
            });
            contsList.appendChild(lii);
        });
        accountName.setAttribute("disabled", "true");
        accountName.value=aObj["accountName"];
    }
    else if(aObj!=="Dummy")
    {
        contactName.value=cObj["contactName"];
        contactName.setAttribute("disabled", "true");
        accountName.setAttribute("disabled", "true");
        accountName.value=aObj["accountName"];
    }
    
}
// stages 
if(pipeLineChoice.value=="standard"){
    stage.innerHTML=standardPipeLine;
}
else if(pipeLineChoice.value=="deepa"){
    stage.innerHTML=deepaPipeLine;
}
// Set Stage options - based on url param -Deal Creation From kambanView
if((param.get("pipeLine")=="deepa")){
    pipeLineChoice.value="deepa";
    stage.innerHTML=deepaPipeLine;
}
else if((param.get("pipeLine"))=="standardView"){
    pipeLineChoice.value="standard"
    stage.innerHTML=standardPipeLine;
}

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
    let allContacts=await getAll("contacts");
        let allAccounts=await getAll("accounts");
        allContacts.forEach(obj => {
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["contactName"]}</li>`;
            lii.addEventListener("click", (e)=>{
                e.preventDefault();
                contactName.id=obj.id;
                contactName.value=obj["contactName"];    
                lookUpForContact.style.display="none";
            });
            contsList.appendChild(lii);
        });
        allAccounts.forEach(obj=>{
            let lii=document.createElement("li")
            lii.innerHTML=`<li value=${obj.id}>${obj["accountName"]}</li>`;
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

    if(!pipeLineInp.value || !dealName.value || !contactName.value || !amount.value || !stage.value)
    {
        !dealName.value?setError(dealName):setSuccess(dealName);
        !contactName.value?setError(contactName):setSuccess(contactName);
        !amount.value?setError(amount):setSuccess(amount);
        !pipeLineInp.value?setError(pipeLineInp):setSuccess(pipeLineInp);
        !stage.value?setError(stage):setSuccess(stage);
        return;
    }
    let obj={
        "dealOwner":dealOwner.value,
        "dealName":dealName.value,
        "contactName":contactName.value,
        "accountName":accountName.value,
        "dateOf":dateOfDealCreation.value,
        "amount":amount.value,
        "closingDate":closingDate.value,
        "pipeLine":pipeLineInp.value,
        "stage":stage.value,
        "contactId":"",
        "accountId":""
    }
        obj["contactId"]=!contactId?contactName.id:contactId;
        obj["accountId"]=!accountId?(accIdFromAccModule?accIdFromAccModule:accountName.id):accountId;
        let DEAL=!dealToBeEdited?saveDeal(obj):updateDeal(obj);
        // window.location.href=clicked?`../deal/dealList.html`:"../deal/createDealForm.html";
});

//Update Contact and Account by adding deal details.
async function updateContactAccount(dealObj, cId, aId)
{
    try {
        //fetch contact- to update deal details to contact
        let contactToBeUpdated= await fetchContById(cId);
        contactToBeUpdated["deals"].push(dealObj["_id"]);

        // fetch account to update  the deal details
        let accountToBeUpdated=await fetchAccById(aId);
        accountToBeUpdated["deals"].push(dealObj["_id"]);

        // put method for contact
        let putContact=await fetch(`/update/contacts/${cId}`, {
        method:"PUT", 
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(contactToBeUpdated)
         });

         let updatedCotact=await putContact.json();

         // put method for account
         let putAccount=await fetch(`/update/accounts/${aId}`,{
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
            let res=await fetch(`/post/deals`, {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(obj)
            });
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
        let res=await fetch(`/update/deals/${dealToBeEdited}`, {
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
    dateFormat: "M d, Y",
});


// Fetch to get Contact Details By Id
async function getById(conId, module) {
    try {
        let res=await fetch(`/getById/${module}/${conId}`);
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
async function getAll(module) {
    try {
        let res=await fetch(`/getAll/${module}`);
    if(!res.ok){
        throw new Error("Error in Fetching Data");
    }
    let arr=await res.json();
    return arr;
    } catch (error) {
        console.log("error"+error);
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
// });

// Form Validation
function setError(tag)
{
    tag.style.borderRadius="2px";
    if(!tag.value)
    {
        tag.style.border="1px solid red";
        tag.nextElementSibling.textContent="Required...."
        tag.nextElementSibling.style.color="red";
    }
    else setSuccess(tag);
}
function setSuccess(tag)
{
    tag.style.border="1px solid black";
    tag.nextElementSibling.innerHTML="";
}


