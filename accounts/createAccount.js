let url=window.location.search;
let param=new URLSearchParams(url);
let id=param.get("id");
console.log("Lead Id : "+id);

let cancelBtn=document.querySelector("#cancelBtn");
let saveBtn=document.querySelector("#leadSubmitBtn");
let saveNewBtn=document.querySelector("#saveNewBtn");
let accForm=document.querySelector("#formm");

cancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href="/accounts/accountList.html";
    e.stopPropagation();
});



let clicked=null;

saveBtn.addEventListener("click",(e)=>{
    // e.preventDefault();
    clicked=1;
    accForm.requestSubmit();
    e.stopPropagation();
});

saveNewBtn.addEventListener("click", (e)=>{
    // e.preventDefault();
    clicked=0;
    accForm.requestSubmit();
    e.stopPropagation();
});

// / POST Method- Storing Data to JSON
async function  saveAccount(obj)
{
    let res=await fetch("/post/accounts",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(obj)
    });
    let out=await res.json();
    console.log(out);
    accId=out["_id"];
    console.log("Account Id: "+accId);
    if(contactId!=null)
    {
        fetchContactAndUpdateIt(accId, contactId);
    }
}

async function fetchContactAndUpdateIt(accountId, ContactId)
{
    let res=await fetch(`/getById/leads/${ContactId}`);
    if(!res.ok)
    {
        throw new Error("Error in Promise");
    }
    else
    {
        let fetchedContact=await res.json();
        console.log(fetchedContact);
        
        let contactObj=createContactObject(fetchedContact, accountId);
        if(postContact(contactObj))
        {
            deleteFromLead(ContactId);
        }
        else{
            throw new Error("Error in POsting Contact")
        }
       
    }

}

// Delete Lead From Leads
async function deleteFromLead(ContactId){
    let res=await fetch(`/delete/leads/${ContactId}`,{
        method:"DELETE",
        headers:{"Content-Type":"application/json"}
    });
    let out=await res.json();
    return out;
}
function createContactObject(leadObj, aId)
{
    let obj={
        "contactName":leadObj["leadName"],
        "contactMail":leadObj["leadMail"],
        "phone":leadObj["phone"],
        "address":leadObj["address"],
        "date":leadObj["date"],
        "organization":leadObj["organization"], 
        "organiztionId":aId,
        "deals":[]
    }
    return obj;
}
async function postContact(cotactObj)
{
   try {
    let res=await fetch(`/post/contacts`, {
        method:"POST", 
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(cotactObj)
    });
    if(res.ok)
    {
        let out=await res.json();
        console.log(out);
        return true;
        
    }
    else{
        throw new Error("Error in Posting Contact")
    }
   } catch (error) {
    
   }
    
}


// Form Fields 
let accountOwner=document.querySelector("#accountOwner");
let accountName=document.querySelector("#AccountName");
let accountMail=document.querySelector("#accountMail");
let phone=document.querySelector("#phone");
let date=document.querySelector("#date");
let address=document.querySelector("#accountAddress");
let annualRevenue=document.querySelector("#annualRevenue");
let contactId;


if(id!=null)
    {
        contactId=id;
    }

accForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(!accountOwner.value || !accountName.value || !accountMail.value || !phone.value || !annualRevenue.value)
    {
        !accountOwner.value?setError(accountOwner):setSuccess(accountOwner);
        !accountName.value?setError(accountName):setSuccess(accountName);
        !accountMail.value?setError(accountMail):mailValidation(accountMail);
        !phone.value?setError(phone):mobileValidation(phone);
        !annualRevenue.value?setError(annualRevenue):setSuccess(annualRevenue);
        // !address.value?setError(address):setSuccess(address);
        return;
    }

    let obj={
        "accountOwner":accountOwner.value,
        "accountName":accountName.value,
        "accountMail":accountMail.value,
        "phone":phone.value,
        "date":date.value,
        "accountAddress":address.value,
        "annualRevenue":annualRevenue.value, 
        "contacts":!contactId?[]:[contactId],
        "deals":[]
    }

    saveAccount(obj);
    // window.location.href=clicked?"http://127.0.0.1:5500/accounts/accountList.html":"http://127.0.0.1:5500/accounts/createAccount.html";
    clicked=null;
});
let accId;

flatpickr(".datePicker", {
    // You can add options here
    dateFormat: "Y-m-d",
});


// Form Field Validation
function setError(tag)
{
    if(tag.value=="")
    {
        tag.style.borderColor="red";
        tag.nextElementSibling.textContent="Required...";
        tag.nextElementSibling.style.color="red";
    }
    else setSuccess(tag)
}

function setSuccess(tag)
{
    if(tag.value!=null)
    {
        tag.style.borderColor="black";
        tag.nextElementSibling.textContent="";
    }
}

function mailValidation(tag)
{
    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(tag.value)) 
    {
           setError(tag);
            tag.nextElementSibling.innerHTML = "Enter Valid Email...";
    }
    else setSuccess(tag);
}

function mobileValidation(tag)
{
    if (!(/^[6-9]\d{9}$/).test(tag.value)) {
        setError(tag);
        tag.nextElementSibling.innerHTML = "number should start with 6-9."
    }else if((tag.value).length!=10)
    {
        setError(tag);
        tag.nextElementSibling.innerHTML="Number Should be 10 Digits";
    }
    else setSuccess(tag);
}
