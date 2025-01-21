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

let contactOwner = document.querySelector("#contact-owner");
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let contactMail = document.querySelector("#contactMail");
let phone = document.querySelector("#contactPhone");
let date = document.querySelector("#date");
let city = document.querySelector("#contact-city");
let state = document.querySelector("#contact-state");

let organizationId = document.querySelector("#organization");
let department = document.querySelector("#department");
let orgMail = document.querySelector("#org-email");
let orgPhone = document.querySelector("#org-phone");
let annualIncome = document.querySelector("#annual-income");
let orgAddress = document.querySelector("#org-address");
let contactCountry = document.querySelector("#contact-country");

let lookupForOrg = document.querySelector(".org-list");
organizationId.addEventListener("click", (e)=>{
    e.preventDefault();
    (document.querySelector(".lookup-for-organization")).style.display="flex";
});

let orgName;
let orgId;
function selectedOrg(liTag) {
    orgId = liTag.id;
    orgName = liTag.textContent;
    organizationId.value=orgName;
    (document.querySelector(".lookup-for-organization")).style.display="none";
}
document.addEventListener('click', (event) => {
    if (!organizationId.contains(event.target) && !(document.querySelector(".lookup-for-organization")).contains(event.target)) {
        (document.querySelector(".lookup-for-organization")).style.display = 'none';
    }
  });
// LookUp For Account Names
async function getAccounts(){
    let res=await fetch(`/mongodb/getAll/accounts`);
    let accs=await res.json();
    if(res.ok){
        accs.forEach(obj => {
            let option=`<li value="${obj["accountName"]}" id="${obj["_id"]}" onclick='selectedOrg(this)'>${obj["accountName"]}</li>`;
            lookupForOrg.insertAdjacentHTML('beforeend', option);
        });
    }
    else {
        
    }  
}
getAccounts();

form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    let flag = false;
    if(!contactOwner.value || !firstName.value || !contactMail.value || !phone.value )
    {
        // flag = !contactOwner.value ? setError(contactOwner) : setSuccess(contactOwner);
        flag = !firstName.value ? setError(firstName) : setSuccess(firstName);
        flag = !contactMail.value ? mailValidation(contactMail) : setSuccess(contactMail);
        flag = !phone.value ? mobileValidation(phone) : setSuccess(phone);
    }
    else{
        flag = !contactOwner.value ? setError(contactOwner) : setSuccess(contactOwner);
        flag = !firstName.value ? setError(firstName) : setSuccess(firstName);
        flag = !contactMail.value ? mailValidation(contactMail) : setSuccess(contactMail);
        flag = !phone.value ? mobileValidation(phone) : setSuccess(phone);
    }
    let obj = {
        "contactOwner":contactOwner.value,
        "firstName":firstName.value,
        "lastName":lastName.value,
        "date": date.value,
        "contactMail":contactMail.value,
        "phone":phone.value,
        "contactCity":city.value,
        "contactState":state.value,
        "organization":orgName,
        "organizationId":orgId,
        "department":department.value,
        "organizationMail":orgMail.value,
        "organizationPhone":orgPhone.value,
        "annualIncome":annualIncome.value,
        "organzationAddress":orgAddress.value,
        "contactCountry":contactCountry.value,
        "deals":[],
    };
    if(flag){
        let postContactData = await postContact(obj);
        alert("SuccessFully Contact Created!");
        window.location.href = clicked ? "/html/contacts/contactList.html" :  "/html/contacts/contactForm.html";
    }
    else{

    }
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

flatpickr(".datePicker", {
    dateFormat: "Y-m-d",
});

function setError(tag) {
    tag.style.border= "1.5px solid red";
    tag.style.borderRadius = "3px";
    tag.nextElementSibling.innerHTML = "Required..,";
    tag.nextElementSibling.style.color = "red";
    return false;
}
function setSuccess(tag) {
    tag.style.border = "1px solid black";
    tag.style.borderRadius = "3px"
    tag.nextElementSibling.innerHTML = "";
    return true;
}

function mailValidation(tag) {
    if (tag.value == "") 
    {
        return setError(tag);
    }
    else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(tag.value)) 
    {
        tag.nextElementSibling.innerHTML = "Enter Valid Email...";
        return setError(tag);
    }
    else return setSuccess(tag);
}

function mobileValidation(tag) {
    if (!(/^[6-9]\d{9}$/).test(tag.value)) {
        
        tag.nextElementSibling.innerHTML = "number should start with 6-9."
        return setError(tag);
    }
    else if((tag.value).length!=10)
    {
        
        tag.nextElementSibling.innerHTML="Number Should be 10 Digits";
        return setError(tag);
    }
    else return setSuccess(tag);
}
