// Getting URL --> If deal creation handled by contact

let url=window.location.search;
let param=new URLSearchParams(url);

let contactId=param.get("id");
let accountId=param.get("accId");
console.log("ContactId="+contactId);
console.log("AccountId="+accountId);



let fetchedContact;
let fetchedAccount;
if(contactId!=null  && accountId!=null)
{
    getContact(contactId, accountId)
}


// Fetch Contact & Account Details
async function getContact(cId, aId) 
{
    try {
        let contactRes=await fetch(`http://localhost:3000/contacts/${cId}`);
        let contactObj=await contactRes.json();

        let accountRes=await fetch(`http://localhost:3000/accounts/${aId}`);
        let accObj=await accountRes.json();
            setDataToFormFields(contactObj, accObj);    
    } catch (error) {
      console.error(error);
      
    }
}

let myForm=document.querySelector("form");

// save and saveNew
let clicked=null;

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


// Setting predefined values of existing account and contact
function setDataToFormFields(cObj, aObj)
{
    contactName.value=cObj["Contact Name"];
    contactName.setAttribute("disabled", "true");
    accountName.setAttribute("disabled", "true");
    accountName.value=aObj["AccountName"];
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
        let cr1=await fetch(`http://localhost:3000/contacts/${cId}`);
        let contactToBeUpdated=await cr1.json();
        contactToBeUpdated["deals"].push(dealObj["id"]);

        // fetch account to update about the deal details
        let ar1=await fetch(`http://localhost:3000/accounts/${aId}`);
        let accountToBeUpdated=await ar1.json();
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

// POST - Save Dato to JSON

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


