let url=window.location.search;
let param=new URLSearchParams(url);
console.log(param.get("id"));

let submitBtn = document.querySelector("#leadSubmitBtn");

let form = document.querySelector("form");

//Cancel Button
let cancelBtn = document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:5500/leadForm/leadList.html";
});

// Save Button Event
submitBtn.addEventListener("click", () => {
    form.requestSubmit();
    window.location.href = "http://127.0.0.1:5500/leadForm/leadList.html";
    
});


// Form Input Fields
let leadName = document.querySelector("#leadName");
let leadMail = document.querySelector("#leadMail");
let leadPhone = document.querySelector("#phone");
let leadAddress = document.querySelector("#LeadAddress");
let organization = document.querySelector("#organization");
let date=document.querySelector("#date");
let inpArr = [leadName, leadMail, leadPhone, leadAddress, organization, date];
let keyArr=["Lead Name", "Lead Mail", "Phone", "Date","Address", "Organization"];


//================>>>>>>>>>>
    fetch(`http://localhost:3000/leads/${param.get("id")}`)
.then(res=>{
    return res.json();
}).then(respo=>
    {
        enterValue(respo)
        console.log(respo);
        
    }).catch(err=>{});

function enterValue(obj)
{
    for (const key in obj) 
    {
        if("id"==key) continue;
        switch(key)
        {
            case "Lead Name":
                leadName.value=obj[key];
                break;
            case "Lead Mail":
                leadMail.value=obj[key];
                break;
            case "Phone":
                leadPhone.value=obj[key];
                break;
            case "Address":
                leadAddress.value=obj[key];
                break;
            case "Organization":
                organization.value=obj[key];
                break;
            case "date":
                date.value=obj[key];
                break;
        }    
    }
}
//================>>>>>>>>>>

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let inpArr = [leadName, leadMail, leadPhone, leadAddress, organization, date];
    // Form Validation Part 
    if(!leadAddress.value || !leadMail.value || !leadName.value || !leadPhone.value)
    {
        leadName.value ? setSuccess(leadName) :setError(leadName) ;
        leadMail.value ? mailValidation(leadMail) :setError(leadMail) ;
        leadPhone.value ? mobileValidation(leadPhone) :setError(leadPhone) ;
        leadAddress.value ? setSuccess(leadAddress) :setError(leadAddress) ;
        // organization.value ? setSuccess(organization) :setError(organization);
        return;
    }


     // Storing data to Object

     let obj = {};
    inpArr.forEach(e => {
        switch(e)
        {
            case leadName:
                obj["Lead Name"]=e.value;
                break;
            case leadMail:
                obj["Lead Mail"]=e.value;
                break;
            case leadPhone:
                obj["Phone"]=e.value;
                break;
            case leadAddress:
                obj["Address"]=e.value;
                break;
            case date:
                obj["date"]=e.value;
                break;
            case organization:
                obj["Organization"]=e.value;
                break;
        }
    })
    console.log(obj);
    
 
     // Fetch Starts Here== POST Method
 inpArr.forEach(e=>{
     if(e === "") return; 
 })
     fetch(`http://localhost:3000/leads/${param.get("id")}`, {
         method: "PUT",
         headers: {
             "Content-Type": "application/json",
         },
         body: JSON.stringify(obj)
     }).then(res => {
         return res.json();
     }).then(result => {
         console.log(result);
     });
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