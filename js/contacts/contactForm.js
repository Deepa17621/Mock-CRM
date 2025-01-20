// const { every } = require("lodash");

let form = document.querySelector("form");

let cancelBtn = document.querySelector("#cancelBtn");
let saveAndNewBtn = document.querySelector("#saveNewBtn");
let saveBtn = document.querySelector("#contactSubmitBtn");
let clicked = null;

cancelBtn.addEventListener("click", () =>{
    window.location.href="/html/contacts/contactList.html";
});

saveAndNewBtn.addEventListener("click", ()=>{
    clicked = 0;
    form.requestSubmit();
});

saveBtn.addEventListener("click", ()=>{
    clicked = 1;
    form.requestSubmit();
});

let contactName = document.querySelector("#contactName");
let contactMail = document.querySelector("#contactMail");
let phone = document.querySelector("#contactPhone");
let date = document.querySelector("#date");
let address = document.querySelector("#contactAddress");
let organizationId = document.querySelector("#organization");

let orgName;
let orgId;
// LookUp For Account Names
async function getAccounts(){
    let res=await fetch(`/mongodb/getAll/accounts`);
    let accs=await res.json();
    if(res.ok){
        accs.forEach(obj => {
            let option=`<option value="${obj["_id"]}">${obj["accountName"]}</option>`;
            organizationId.insertAdjacentHTML('beforeend', option);
        });
    }
    else {
        
    }  
}
getAccounts();
organizationId.addEventListener("change", (e) =>{
    e.preventDefault();
    console.log(organizationId);
    orgId = e.target.value;
    orgName = organizationId.options[organizationId.selectedIndex].text;
});

//Form Event--Getting Data From Form

form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    
    if(!contactName.value || !contactMail.value || !phone.value )
    {
        !contactName.value ? setError(contactName) : setSuccess(contactName);
        !contactMail.value ? mailValidation(contactMail) : setSuccess(contactMail);
        !phone.value ? mobileValidation(phone) : setSuccess(phone);
        // !date.value?setError(date):setSuccess(date);
        // !address.value?setError(address):setSuccess(address);
        // !organization.value?setError(organization):setSuccess(organization);
        return;
    }
    let obj = {
        "contactName":contactName.value,
        "contactMail":contactMail.value,
        "phone":phone.value,
        "address":address.value,
        "organization":orgName,
        "organizationId":orgId,
        "deals":[],
    };
    await postContact(obj);
    window.location.href = clicked ? "/html/contacts/contactList.html" :  "/html/contacts/contactForm.html";
});

// Post - Contact Data 
async function postContact(obj) {
    try {
        let res=await fetch(`/mongodb/post/contacts`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(obj)
        });
        let data= await res.json();
        if(res.ok)
        {
            console.log(data);
            await updateAccountFormLookUp(data["_id"]); 
        }
        else throw new Error("Error: "+ res.status+ " "+ res.statusText);
    } catch (error) {
        
    }
}

// Update Account By Adding Contact Id 
async function updateAccountFormLookUp(contactId) {
    console.log("Entered into update account");
    
    let accRes=await fetch(`/mongodb/getById/accounts/${orgId}`);
    let accObj=await accRes.json();
    if(accRes.ok){
        console.log(accObj);
    }
    accObj["contacts"].push(contactId);    

    // PUT FOR Accounts to update the new Contact to Organization

    let putAcc=await fetch(`/mongodb/update/accounts/${orgId}`, {
        method:"PUT",
        body:JSON.stringify(accObj)
    });
    if(putAcc.ok){
        console.log("Account Updated");
        
    }
}

// FlatPickr
flatpickr(".datePicker", {
    // You can add options here
    dateFormat: "Y-m-d",
});
//Set Error
function setError(tag) {
    tag.style.borderColor = "red";
    tag.nextElementSibling.innerHTML = "Required..,";
    tag.nextElementSibling.style.color = "red";
}
function setSuccess(tag) {
    tag.style.borderColor = "black";
    tag.nextElementSibling.innerHTML = "";
}

function mailValidation(tag) {
    if (tag.value == "") 
    {
        setError(tag);
    }
    else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(tag.value)) 
    {
        setError(tag);
        tag.nextElementSibling.innerHTML = "Enter Valid Email...";
    }
    else setSuccess(tag);
}

function mobileValidation(tag) {
    if (!(/^[6-9]\d{9}$/).test(tag.value)) {
        setError(tag);
        tag.nextElementSibling.innerHTML = "number should start with 6-9."
    }
    else if((tag.value).length!=10)
    {
        setError(tag);
        tag.nextElementSibling.innerHTML="Number Should be 10 Digits";
    }
    else setSuccess(tag);
}

// Dynamic Field Form
// let individual=document.querySelector("#Individual");
// let existing=document.querySelector("#Existing");
// let newAcco=document.querySelector("#newAccount");
// individual.addEventListener("click", (e)=>{
//     e.preventDefault();
//     organizationId.disabled="true";
// });
// existing.addEventListener("click", (e)=>{
//     e.preventDefault();
//     organization.removeAttribute("disabled");
// });
// newAcco.addEventListener("click", (e)=>{
//     e.preventDefault();
//     window.location.href=`/html/accounts/createAccount.html`;
// });

// Dynamic Field 
let radioForDynamicField = document.querySelectorAll(`input[name="dynamic-field"]`);
radioForDynamicField.forEach(element => {
    element.addEventListener("change", (e)=>{
        // e.preventDefault();
        if((e.target).id === "company"){
            (document.querySelector(".right-form")).classList.add("active-organization");
        }
        else if((e.target).id === "newAcc"){
            window.location.href=`/html/account/createAccount.html`;
        }
        else{
            (document.querySelector(".right-form")).classList.remove("active-organization");
        }
    });
});