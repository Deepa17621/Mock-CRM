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
function stages1()
{
    stages=document.querySelector("stages").value;
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
        "Stage":stages.value
    }
    saveDeal(obj);
    window.location.href=clicked?`http://127.0.0.1:5500/deal/dealList.html`:"http://127.0.0.1:5500/deal/createDealForm.html";
});

// POST - Save Dato to JSON
async function saveDeal(obj)
{
    let res=await fetch("http://localhost:3000/deals", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(obj)
    });
    let out=await res.json();
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


