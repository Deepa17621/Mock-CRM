let url = window.location.search;
let param = new URLSearchParams(url);
let id = param.get("id");
console.log("Lead Id : "+id);

let cancelBtn = document.querySelector("#cancelBtn");
let saveBtn = document.querySelector("#leadSubmitBtn");
let saveNewBtn = document.querySelector("#saveNewBtn");
let accForm = document.querySelector("#formm");

let contactId;

cancelBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href="/html/accounts/accountList.html";
    e.stopPropagation();
});

let clicked = null;

saveBtn.addEventListener("click",(e)=>{
    // e.preventDefault();
    clicked = 1;
    accForm.requestSubmit();
    e.stopPropagation();
});

saveNewBtn.addEventListener("click", (e)=>{
    // e.preventDefault();
    clicked = 0;
    accForm.requestSubmit();
    e.stopPropagation();
});

// / POST Method- Storing Data to JSON
async function  saveAccount(obj)
{
    let res=await fetch("/mongodb/post/accounts",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(obj)
    });
    if(res.ok){
        let out = await res.json();
        console.log(out);
        console.log(out["_id"]);
        if(contactId != null){
            await fetchContactAndUpdateIt(out["_id"], contactId);
        }
        return true;
    }
    
}

async function fetchContactAndUpdateIt(accountId, ContactId){

    let res = await fetch(`/mongodb/getById/leads/${ContactId}`);

    if(!res.ok){
        throw new Error("Error in Promise");
    }
    else{
        let fetchedContact = await res.json();
        let newContact = createContactObject(fetchedContact, accountId);
        if(postContact(newContact)){
            await deleteFromLead(ContactId);
        }
        else{
            throw new Error("Error in POsting Contact")
        }
       
    }

}


// Delete Lead From Leads
async function deleteFromLead(ContactId){
    let res = await fetch(`/mongodb/delete/leads/${ContactId}`,{
        method:"DELETE",
        headers:{"Content-Type":"application/json"}
    });
    let out = await res.json();
    return out;
}

function createContactObject(leadObj, aId){
    let obj = {
        "contactName" : leadObj["leadName"],
        "contactMail" : leadObj["leadMail"],
        "phone"       : leadObj["phone"],
        "address"     : leadObj["address"],
        "date"        : leadObj["date"],
        "organization": leadObj["organization"], ///////---------------------------need to check 
        "organiztionId": `${aId}`, ///------------------------
        "deals"       : []
    }
    return obj;
}
async function postContact(myObj){
   try {
    let res = await fetch(`/mongodb/post/contacts`, {
        method : "POST", 
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify(myObj)
    });
    if(res.ok){
        let out = await res.json();
        console.log(out);
        return true; 
    }
    else{
        throw new Error("Error in Posting Contact")
    }
   } catch (error) {}
    
}

// Form Fields 
let accountOwner = document.querySelector("#acc-owner");
let accountName = document.querySelector("#acc-name");
let accountMail = document.querySelector("#acc-mail");
let accSite = document.querySelector("#acc-site");
let date = document.querySelector("#date");
// let address = document.querySelector("#accountAddress");
let annualRevenue = document.querySelector("#revenue");
let phone = document.querySelector("#phone");
let contact = document.querySelector("#contact");
let website = document.querySelector("#website");
let billingCity = document.querySelector("#billing-city");
let billingState = document.querySelector("#billing-state");
let billingCountry = document.querySelector("#billing-country");
let shippingCity = document.querySelector("#shipping-city");
let shippingState = document.querySelector("#shipping-state");
let shippingCountry = document.querySelector("#shipping-country");
let amount = document.querySelector("#amount");

if(id!=null){   // Here "id" refers Contact Id (Param)
    contactId=id;
}

accForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    let flag = false;
    if(!accountOwner.value || !accountName.value || !accountMail.value || !phone.value || !annualRevenue.value)
    {
        flag = !accountOwner.value ? setError(accountOwner) : setSuccess(accountOwner);
        flag = !accountName.value ? setError(accountName) : setSuccess(accountName);
        flag = !accountMail.value ? setError(accountMail) : mailValidation(accountMail);
        flag = !phone.value ? setError(phone) : mobileValidation(phone);
        flag = !annualRevenue.value ? setError(annualRevenue) : setSuccess(annualRevenue);
    }
    else{
        flag = !accountOwner.value ? setError(accountOwner) : setSuccess(accountOwner);
        console.log(flag);
        flag = !accountName.value ? setError(accountName) : setSuccess(accountName);
        console.log(flag);
        flag = !accountMail.value ? setError(accountMail) : mailValidation(accountMail);
        console.log(flag);
        flag = !phone.value ? setError(phone) : mobileValidation(phone);
        console.log(flag);
        flag = !annualRevenue.value ? setError(annualRevenue) : setSuccess(annualRevenue);
    }

    let obj = {
        "accountOwner" : accountOwner.value,
        "accountName" : accountName.value,
        "accountMail" : accountMail.value,
        "accountSite" : accSite.value,
        "date" : date.value,
        "phone" : phone.value,
        "annualRevenue" : annualRevenue.value, 
        "website" : website.value,
        "billingCity": billingCity.value,
        "billingState": billingState.value,
        "billingCountry": billingCountry.value,
        "shippingCity": shippingCity.value,
        "shippingState": shippingState.value,
        "shippingCountry": shippingCountry.value,
        "amount": amount.value,
        "contacts" : !contactId?[contact.id]:[contactId,],
        "deals":[]
    }

    if(flag){
        let data = await saveAccount(obj);
        if(data)
        {
            alert("Account Added Successfully!");
            window.location.href=clicked?"/html/accounts/accountList.html":"/html/accounts/createAccount.html";
            clicked=null;
        }
    }
});
let accId;

flatpickr(".datePicker", {
    dateFormat: "Y-m-d",
});

function setError(tag)
{
    if(tag.value=="")
    {
        tag.style.borderColor="red";
        tag.nextElementSibling.textContent="Required...";
        tag.nextElementSibling.style.color="red";
        tag.nextElementSibling.classList.add("err");
        return false;
    }
    else return setSuccess(tag)
}

function setSuccess(tag)
{
    if(tag.value!=null)
    {
        tag.style.borderColor="black";
        tag.nextElementSibling.textContent="";
        tag.nextElementSibling.classList.add("err");
        return true;
    }
}

function mailValidation(tag)
{
    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(tag.value)) 
    {
        tag.nextElementSibling.innerHTML = "Enter Valid Email...";
        return setError(tag);
    }
    else return setSuccess(tag);
}

function mobileValidation(tag)
{
    if (!(/^[6-9]\d{9}$/).test(tag.value)) {
        tag.nextElementSibling.innerHTML = "number should start with 6-9.";
        return setError(tag);
    }else if((tag.value).length!=10)
    {
        tag.nextElementSibling.innerHTML="Number Should be 10 Digits";
        return  setError(tag);
    }
    else return setSuccess(tag);
}
