let form=document.querySelector("form");

let cancelBtn=document.querySelector("#cancelBtn");
let saveAndNewBtn=document.querySelector("#saveNewBtn");
let saveBtn=document.querySelector("#contactSubmitBtn");
let clicked=null;
cancelBtn.addEventListener("click", ()=>{
    window.location.href="http://127.0.0.1:5500/contact/contactList.html";
});

saveAndNewBtn.addEventListener("click", ()=>{
    clicked=0;
    form.requestSubmit();
});

saveBtn.addEventListener("click", ()=>{
    clicked=1;
    form.requestSubmit();
});

let contactName=document.querySelector("#contactName");
let contactMail=document.querySelector("#contactMail");
let phone=document.querySelector("#contactPhone");
let date=document.querySelector("#date");
let address=document.querySelector("#contactAddress");
let organization=document.querySelector("#organization");
let inpArr=[contactName, contactMail, phone, date, address, organization, ];

//Form Event--Getting Data From Form

form.addEventListener("submit", (e)=>{
    e.preventDefault();

    if(!contactName.value || !contactMail.value || !phone.value || !date.value || !address.value || !organization.value)
    {
        !contactName.value?setError(contactName):setSuccess(contactName);
        !contactMail.value?mailValidation(contactMail):setSuccess(contactMail);
        !phone.value?mobileValidation(phone):setSuccess(phone);
        !date.value?setError(date):setSuccess(date);
        !address.value?setError(address):setSuccess(address);
        !organization.value?setError(organization):setSuccess(organization);
        return;
    }
    let obj = {
        "deals":[],
    };
    inpArr.forEach(e => {
        switch(e)
        {
            case contactName:
                obj["Contact Name"]=e.value;
                break;
            case contactMail:
                obj["Contact Mail"]=e.value;
                break;
            case phone:
                obj["Phone"]=e.value;
                break;
            case address:
                obj["Address"]=e.value;
                break;
            case date:
                obj["date"]=e.value;
                break;
            case organization:
                obj["OrganizationId"]=e.value;
                break;
        }
    });
   

    inpArr.forEach(e=>{
        if(e.value==="") return;
    });

    // Storing Object To Json
    fetch("http://localhost:3000/contacts", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(obj)
    }).then(res => {
        return res.json();
    }).then(result => {
        updateAccountFromLookUp(result["id"]);
        console.log(result);
        
    });
    return;
    window.location.href = clicked ? "http://127.0.0.1:5500/contact/contactList.html" :  "http://127.0.0.1:5500/contact/contactForm.html";
    clicked = null;
});

// Update Account By Adding Cotact Id 
async function updateAccountFromLookUp(contactId) {
    let accRes=await fetch(`http://localhost:3000/accounts/${organization.value}`);
    let accObj=await accRes.json();
    accObj["Contacts"].push(contactId);

    // PUT FOR Accounts to update the new Contact to Organization

    let putAcc=await fetch(`http://localhost:3000/accounts/${organization.value}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(accObj)
    });
}


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

// LookUp For Account Names
async function getAccounts(){
    let res=await fetch(`http://localhost:3000/accounts`);
    let accs=await res.json();
    accs.forEach(obj => {
        let option=`<option value="${obj["id"]}">${obj["AccountName"]}</option>`;
        organization.insertAdjacentHTML('beforeend', option);
    });
}
getAccounts()




// Dynamic Field Form

let contactOnly=document.querySelector("#onlyContact");
let existingAccount=document.querySelector("#ExistingAccount");
let newAccount=document.querySelector("#contactWithNewAccount");

