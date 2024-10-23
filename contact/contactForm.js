let form=document.querySelector("form");

let cancelBtn=document.querySelector("#cancelBtn");
let saveAndNewBtn=document.querySelector("#saveNewBtn");
let saveBtn=document.querySelector("#contactSubmitBtn");
let clicked=null;

cancelBtn.addEventListener("click", ()=>{
    window.location.href="/contact/contactList.html";
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
    
    if(!contactName.value || !contactMail.value || !phone.value )
    {
        !contactName.value?setError(contactName):setSuccess(contactName);
        !contactMail.value?mailValidation(contactMail):setSuccess(contactMail);
        !phone.value?mobileValidation(phone):setSuccess(phone);
        // !date.value?setError(date):setSuccess(date);
        // !address.value?setError(address):setSuccess(address);
        // !organization.value?setError(organization):setSuccess(organization);
        return;
    }
    let obj = {
        "deals":[],
    };
    inpArr.forEach(e => {
        switch(e)
        {
            case contactName:
                obj["contactName"]=e.value;
                break;
            case contactMail:
                obj["contactMail"]=e.value;
                break;
            case phone:
                obj["phone"]=e.value;
                break;
            case address:
                obj["address"]=e.value;
                break;
            case date:
                obj["date"]=e.value;
                break;
            case organization:
                obj["organizationId"]=e.value;
                // obj["organization"]="";
                break;
        }
    });
    // inpArr.forEach(e=>{
    //     if(e.value==="") return;
    // });
    postContact(obj);
    // window.location.href = clicked ? "/contact/contactList.html" :  "/contact/contactForm.html";
});

// Post - Contact Data 
async function postContact(obj) {
    try {
        let res=await fetch(`/post/contacts`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(obj)
        });
        let data= await res.json();
        if(res.ok)
        {
            console.log(data);
            updateAccountFormLookUp(result["_id"]); 
        }
        else throw new Error("Error: "+ res.status+ " "+ res.statusText);
    } catch (error) {
        
    }
}

// Update Account By Adding Contact Id 
async function updateAccountFormLookUp(contactId) {
    let accRes=await fetch(`/getById/accounts/${organization.value}`);
    let accObj=await accRes.json();
    accObj["contacts"].push(contactId);

    // PUT FOR Accounts to update the new Contact to Organization

    let putAcc=await fetch(`/update/accounts/${organization.value}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(accObj)
    });
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

// LookUp For Account Names
async function getAccounts(){
    let res=await fetch(`/getAll/accounts`);
    let accs=await res.json();
    if(res.ok){
        accs.forEach(obj => {
            let option=`<option value="${obj["_id"]}" >${obj["accountName"]}</option>`;
            organization.insertAdjacentHTML('beforeend', option);
        });
    }
    else {
        
    }  
}
getAccounts()




// Dynamic Field Form
let individual=document.querySelector("#Individual");
let existing=document.querySelector("#Existing");
let newAcco=document.querySelector("#newAccount");
individual.addEventListener("click", (e)=>{
    e.preventDefault();
    organization.disabled="true";
});
existing.addEventListener("click", (e)=>{
    e.preventDefault();
    organization.removeAttribute("disabled");
});
newAcco.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/accounts/createAccount.html`;
});


