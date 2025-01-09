let submitBtn = document.querySelector("#leadSubmitBtn");

let form = document.querySelector("form");

let clicked = null;

let cancelBtn = document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click", () => {
    window.location.href = "/html/leads/leadList.html";
});

let saveAndNew = document.querySelector("#saveNewBtn");
saveAndNew.addEventListener("click", () => {
    clicked = 0;
    form.requestSubmit();
});

submitBtn.addEventListener("click", () => {
    clicked = 1;
    form.requestSubmit();
});

// Form Input Fields
let leadOwner = document.querySelector("#lead-owner");
let firstName = document.querySelector("#first-name");
let lastName = document.querySelector("#last-name");
let titlerole = document.querySelector("#role-title");
let email = document.querySelector("#email");
let phone = document.querySelector("#phone");
let fax = document.querySelector("#fax");
let website = document.querySelector("#website");
let date=document.querySelector("#date");
let empCount = document.querySelector("#emp-count");
let annualRevenue = document.querySelector("#revenue");
let city = document.querySelector("#city");
let state = document.querySelector("#state");
let country = document.querySelector("#country");
let postalCode = document.querySelector("#postal-code")
// let inpArr = [leadName, leadMail, leadPhone, leadAddress,date, organization];


form.addEventListener("submit", async(e) => {
    e.preventDefault();
    let flag = false;
    if(!leadOwner.value || !firstName.value || !phone.value || !email.value)
    {
        flag = leadOwner.value ? setSuccess(leadOwner) : setError(leadOwner);
        flag = firstName.value ? setSuccess(firstName) :setError(firstName) ;
        flag = phone.value ? mobileValidation(phone) :setError(phone);
        flag = email.value ? mailValidation(email) :setError(email) ;
    }
    else{
        flag = leadOwner.value ? setSuccess(leadOwner) : setError(leadOwner);
        flag = firstName.value ? setSuccess(firstName) :setError(firstName) ;
        flag = phone.value ? mobileValidation(phone) :setError(phone);
        flag = email.value ? mailValidation(email) :setError(email) ;
    }
    let obj = {};
        obj.leadOwner = leadOwner.value;
        obj.firstName = firstName.value;
        obj.lastName = lastName.value;
        obj.role = titlerole.value;
        obj.email = email.value;
        obj.phone = phone.value;
        obj.fax = fax.value;
        obj.website = website.value;
        obj.date = date.value;
        obj.employeeCount = empCount.value;
        obj.annualRevenue = annualRevenue.value;
        obj.city = city.value;
        obj.state= state.value;
        obj.country = country.value;
        obj.postalCode = postalCode.value;

    if(flag){
        let postLeadData = await saveLead(obj);
        if(postLeadData){
            alert("Successfully created!")
            window.location.href = clicked ? "/html/leads/leadList.html" :  "/html/leads/leadForm.html";
            clicked = null;
        }
    }
    else{
        console.log("Flag -- False!");
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

flatpickr(".datePicker", {
    dateFormat: "Y-m-d",
});


//Set Error
function setError(tag) {
    tag.style.border = "2px solid red";
    tag.style.borderRadius = "3px"
    tag.nextElementSibling.innerHTML = "Required";
    (tag.nextElementSibling).classList.add("err");
    return false;
}
function setSuccess(tag) {
    tag.style.border = "0.5px solid grey";
    tag.style.borderRadius = "3px";
    tag.nextElementSibling.innerHTML = "";
    return true;
}

function mailValidation(tag) {
    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(tag.value)) 
    {
        tag.nextElementSibling.innerHTML = "Enter Valid Email...";
        setError(tag);
    }
    else  return setSuccess(tag);
}

function mobileValidation(element) {
    if (!(/^[6-9]\d{9}$/).test(element.value)) {
        element.nextElementSibling.innerHTML = "number should start with 6-9."
        setError(element);
    }
    else if((element.value).length!=10)
    {
        element.nextElementSibling.innerHTML="Number Should be 10 Digits";
        setError(element);
    }  
    else {
         return setSuccess(element);
    }
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