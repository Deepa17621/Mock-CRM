let submitBtn = document.querySelector("#leadSubmitBtn");

let form = document.querySelector("form");

// Cancel Button Event
let clicked = null;

let cancelBtn = document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click", () => {
    window.location.href = "/html/leads/leadList.html";
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


form.addEventListener("submit", async(e) => {
    e.preventDefault();
    if(!leadAddress.value || !leadMail.value || !leadName.value || !leadPhone.value)
    {
        leadName.value ? setSuccess(leadName) :setError(leadName) ;
        leadMail.value ? mailValidation(leadMail) :setError(leadMail) ;
        leadPhone.value ? mobileValidation(leadPhone) :setError(leadPhone) ;
        leadAddress.value ? setSuccess(leadAddress) :setError(leadAddress) ;
        // organization.value ? setSuccess(organization) :setError(organization);
    }
    
    let obj = {};
    inpArr.forEach(e => {
        switch(e)
        {
            case leadName:
                obj["leadName"]=e.value;
                break;
            case leadMail:
                obj["leadMail"]=e.value;
                break;
            case leadPhone:
                obj["phone"]=e.value;
                break;
            case leadAddress:
                obj["address"]=e.value;
                break;
            case date:
                obj["date"]=e.value;
                break;
            case organization:
                obj["organization"]=e.value;
                break;
        }
       
    });

    // Fetch Starts Here== POST Method
inpArr.forEach(e=>{
    if(e === "") return; 
})
    let postLeadData = await saveLead(obj);
    if(postLeadData){
        window.location.href = clicked ? "/html/leads/leadList.html" :  "/html/leads/leadForm.html";
        clicked = null;
    }

});

async function saveLead(obj) {
    try {
        let res = await fetch('/mongodb/post/leads', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj)
        });
        if(res.ok){
            let data = await res.json();
            return data;
        }
        else {
            throw new Error("Error in save Lead"+res.status);
        }
    } catch (error) {
        console.log(error);
    }
    
}
// Flatpicker
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

// async function getAll() {
//     try {
//         let res=await fetch("/getAll/leads");
//         if(!res.ok)
//         {
//             throw new Error("Error:"+ res.status+ " "+res.statusText);
//         }
//         let data=await res.json();
//         console.log(data);
//     } catch (error) {
//         // console.log(error);   
//     }
// }
// getAll();