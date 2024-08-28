// Get URL To Fetch Data
let url=window.location.search;
let param=new URLSearchParams(url);
let currentId=param.get("id");
console.log(currentId);

let owner=document.querySelector("#accountOwner");
let accountName=document.querySelector("#accountName");
let accountMail=document.querySelector("#accountMail");
let phone=document.querySelector("#phone");
let date=document.querySelector("#date");
let accountAddress=document.querySelector("#accountAddress");
let annualRevenue=document.querySelector("#annualRevenue");

// Fetch Data From JSON
async function fetchData(id)
{
    let res=await fetch(`http://localhost:3000/accounts/${currentId}`);
    let out=await res.json();
    addToForm(out);    
}
function addToForm(obj)
{
    owner.value=obj["AccountOwner"];
    accountName.value=obj["AccountName"];
    accountMail.value=obj["AccountMail"];
    phone.value=obj["Phone"];
    date.value=obj["date"];
    accountAddress.value=obj["AccountAddress"];
    annualRevenue.value=obj["AnnualRevenue"];
}
fetchData(currentId)

// Save Button

let saveBtn=document.querySelector("#leadSubmitBtn");
saveBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    myForm.requestSubmit();
    window.location.href=`http://127.0.0.1:5500/accounts/viewAccount.html?id=${currentId}`;
});

// PUT Data 
async function updateData(obj)
{
    let result=await fetch(`http://localhost:3000/accounts/${currentId}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(obj)
    });
    let out=await result.json();
    return out;
}
// Form Submit Event
let myForm=document.querySelector("form");
myForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    if(!owner.value || !accountName.value || !accountMail.value || !accountAddress.value || !annualRevenue.value)
    {
        !owner.value?setError(owner):setSuccess(owner);
        !accountName.value?setError(accountName):setSuccess(accountName);
        !accountMail.value?setError(accountMail):mailValidation(accountMail);
        !date.value?setError(date):setSuccess(date);
    }
    let obj={
        "AccountOwner":owner.value,
        "AccountName":accountName.value,
        "AccountMail":accountMail.value,
        "Phone":phone.value,
        "date":date.value,
        "AccountAddress":accountAddress.value,
        "AnnualRevenue":annualRevenue.value,
        "Contacts":[],
        "deals":[]
    };
    updateData(obj);
} )
let cancelBtn=document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    window.location.href=`http://127.0.0.1:5500/accounts/viewAccount.html?id=${currentId}`;

});

//validation

// Feild Validation
function setSuccess(tag)
{
    tag.style.borderColor="black";
    tag.nextElementSibling.innerHtml="";
}
function setError(tag)
{
    if(tag.value=="")
    {
        tag.style.borderColor="red";
        tag.nextElementSibling.innerHtml="Required";
        tag.nextElementSibling.style.color="red";
    }
    else
    {
        setSuccess(tag);
    }
}
function mailValidation(tag)
{
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