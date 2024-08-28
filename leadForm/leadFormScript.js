let submitBtn = document.querySelector("#leadSubmitBtn");

let form = document.querySelector("form");

// Cancel Button Event
let clicked = null;

let cancelBtn = document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:5500/leadForm/leadList.html";
});

// Save And New Button
let saveAndNew = document.querySelector("#saveNewBtn");
saveAndNew.addEventListener("click", () => {
    clicked = 0;
    form.requestSubmit();
});
// Button Event
submitBtn.addEventListener("click", () => {
    clicked = 1;
    form.requestSubmit();
});

// Form Input Fields
let leadName = document.querySelector("#leadName");
let leadMail = document.querySelector("#leadMail");
let leadPhone = document.querySelector("#phone");
let leadAddress = document.querySelector("#LeadAddress");
let date=document.querySelector("#date");
let organization = document.querySelector("#organization");
let inpArr = [leadName, leadMail, leadPhone, leadAddress,date, organization];


form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(!leadAddress.value || !leadMail.value || !leadName.value || !leadPhone.value)
    {
        leadName.value ? setSuccess(leadName) :setError(leadName) ;
        leadMail.value ? mailValidation(leadMail) :setError(leadMail) ;
        leadPhone.value ? mobileValidation(leadPhone) :setError(leadPhone) ;
        leadAddress.value ? setSuccess(leadAddress) :setError(leadAddress) ;
        // organization.value ? setSuccess(organization) :setError(organization);
        return;
    }

    // Object to be Stored in JSON
    // let keyArr = ["Lead Name", "Lead Mail", "Phone", "Address","date" ,"Organization"];
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
       
    });

    // Fetch Starts Here== POST Method
inpArr.forEach(e=>{
    if(e === "") return; 
})
    fetch("http://localhost:3000/leads", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
    }).then(res => {
        return res.json();
    }).then(result => {
        console.log(result);
    });
    window.location.href = clicked ? "http://127.0.0.1:5500/leadForm/leadList.html" :  "http://127.0.0.1:5500/leadForm/leadForm.html";
    clicked = null;
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