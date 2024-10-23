let url=window.location.search;
let param=new URLSearchParams(url);
console.log("Clicked Data's id:="+param.get("id"));
let currentId=param.get("id");

let cancelBtn=document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    window.location.href=`/contact/contactView.html?id=${currentId}`;

});

let contactName=document.querySelector("#contactName");
let contactMail=document.querySelector("#contactMail");
let phone=document.querySelector("#phone");
let date=document.querySelector("#date");
let address=document.querySelector("#contactAddress");
let organization=document.querySelector("#organization");

let keys=[contactName,contactMail,phone,date,address,organization];

function display(obj)
{
    for (const key in obj) {
        switch(key)
        {
            case "contactName":
                contactName.value=obj[key];
                break;
            case "contactMail":
                contactMail.value=obj[key];
                break;
            case "phone":
                phone.value=obj[key];
                break;
            case "address":
                address.value=obj[key];
                break;
            case "organization":
                organization.value=obj[key];
                break;
            case "date":
                date.value=obj[key];
                break;
        }
    }
}
// fetch clicked Data
async function getData(id)
{
    try {
        let res=await fetch(`/getById/contacts/${id}`);
        let out=await res.json();
        if(!res.ok){
            throw new Error("Error in fetching contact:"+ res.status);
        }
        display(out);
    } catch (error) {
        console.log(error);
    }
}

getData(currentId);

// PUT Method - Put the updated data to JSON

let saveBtn=document.querySelector("#leadSubmitBtn");
saveBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    formm.requestSubmit();
    window.location.href=`/contact/contactView.html?id=${currentId}`


});
let formm=document.querySelector("form");
let keyArr=["contactName", "contactMail", "phone", "date","address", "organization"];
formm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(!contactMail.value || !contactName.value || !phone.value)
    {
        contactName.value?setSuccess(contactName):setError(contactName);
        contactMail.value?mailValidation(contactMail):setError(contactMail);
        phone.value?mobileValidation(phone):setError(phone);
        return;
    }

    let obj={};

    //Storing data to object to put in json
    keys.forEach(e=>{
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
            case organization:
                obj["organization"]=e.value;
                break;
            case date:
                obj["date"]=e.value;
                break;
        }
    });

    fetch(`/update/contacts/${currentId}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(obj)
    }).then(res=>{return res.json()}).then(res=>{
        return res;
    }).catch(err=>{})
});

flatpickr(".datePicker", {
    dateFormat: "Y-m-d",
});

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




