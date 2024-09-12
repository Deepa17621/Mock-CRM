// const { all } = require("axios");


// 1=> If Contact Converted From Lead Means-->Get Url.
let url = window.location.search;
let param = new URLSearchParams(url);
let currentId = param.get("id");

console.log("Current Id From Contact List :");
console.log(currentId);

// Getting table
let table = document.querySelector("table");

// Search Contact using keywords/Fields name

let searchInp=document.querySelector("#searchField");
let option;
let arr=[];
function selectField()
{
    option=document.querySelector("#fields").value;
}

// create Contact Button 
const createContactBtn=document.querySelector("#createContactBtn");
createContactBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href='http://127.0.0.1:5500/contact/contactForm.html';
})

// lead to contact=>del from lead add to contact
function sendToContact(contact, lead) {
    try {
        let del = deleteLead(lead);
        fetch(`http://localhost:3000/contacts/`, {
            method: "POST",
            headers: { "Content-Type": "applicatio/json" },
            body: JSON.stringify(contact)
        }).then(() => {
            localStorage.setItem("convert","true");
        })
    } catch (error) {
        console.log(error);

    }
}
function deleteLead(lead) {
    try {
        fetch(`http://localhost:3000/leads/${lead}`, {
            method: "DELETE",
            headers: { "Content-Type": "applicatio/json" }
        }).then(() => { return true })
    } catch (error) {
    }
}
// Fetch for getting the converted data from Lead
const fetchDataFromLead = async () => {
let convert = JSON.parse(localStorage.getItem("convert"));
console.log(convert);

    try {
        if(convert === true){
            alert("Converst Success");
            JSON.stringify(localStorage.setItem("convert", "false"));
            return;
        }
        let URL = `http://localhost:3000/leads/${param.get("id")}`
        const fetching = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!fetching.ok) {
            // throw new Error('Error in URL')
        }
        const respo = await fetching.json()
        let obj = {
            "deals":[]
        }
        for (const key in respo) {
            switch (key) {
                case "id":
                    obj["id"] = respo[key];
                    break;
                case "Lead Name":
                    obj["Contact Name"] = respo[key];
                    break;
                case "Lead Mail":
                    obj["Contact Mail"] = respo[key];
                    break;
                case "Phone":
                    obj["Phone"] = respo[key];
                    break;
                case "Address":
                    obj["Address"] = respo[key];
                    break;
                case "Organization":
                    obj["Organization"] = respo[key];
                    break;
                case "date":
                    obj["date"] = respo[key];
                    break;
            }
        }
        // console.log(sendToContact);
        
       sendToContact(obj, currentId)
    } catch (err) {
        console.log(err.message);
    }
}
if (currentId != null) {
    fetchDataFromLead()
}
function rowClickedEvent(id)
{
    window.location.href=`http://127.0.0.1:5500/contact/contactView.html?id=${id}`; 
}

// Table function to Add Data's To Table.
function tableFunction(allContacts)
{
    let keyArr=Object.keys(allContacts[0]);
    console.log("Key Array");
    console.log(keyArr);
    //Create Table And Add Headers to Table.
    let table=document.querySelector("table");
    let thead=document.createElement("tr");
    table.appendChild(thead);
    let thForCheckBox=document.createElement("th");
    thForCheckBox.innerHTML=`<input type="checkbox">`
    thead.appendChild(thForCheckBox);
    keyArr.forEach(e=>{
        let thh=document.createElement("th");
        thh.innerHTML=e;
        thead.appendChild(thh);
    });

    //create Table Body and Add Content to table body
    //Accessing Each Object.
    allContacts.forEach(obj=>{

        //iterator for same order insertion of data.
         let iterator1=keyArr[Symbol.iterator]();
        
         let row=document.createElement("tr");
         row.id=obj["id"];
         row.setAttribute("onclick", "rowClickedEvent(this.id)");
         table.appendChild(row);
         let checkBox21=document.createElement("td");
         row.appendChild(checkBox21);
         checkBox21.innerHTML=`<input type="checkbox">`;
         
         
         for (const key in obj) 
         {
            let val=iterator1.next().value;
            let tdata=document.createElement("td");
            tdata.className=val;
            row.appendChild(tdata)
            if(val=="Contact Mail")
            {
                tdata.innerHTML=`<a href="mailto:${obj[tdata.className]}">${obj[tdata.className]}</a>`;
            }
            else if(val=="Phone")
            {
                tdata.innerHTML=`<a href="tel:${obj[tdata.className]}">${obj[tdata.className]}</a>`
            }
            else{
                tdata.innerHTML=obj[tdata.className];
            }
         }
    })
}
// Filter data From JSON To Display

function filterField(arrOfObjs)
{
    
    arrOfObjs.forEach((ele)=>
    {
        // console.log(ele[`${selectField}`]);
        if((ele[`${option}`].toLowerCase())==((searchInp.value).toLowerCase()))
         {
             console.log("true");
             arr.push(ele);
             console.log(ele);
             return;
         } 
    });
    if(arr.length>0)
    {
        while(table.hasChildNodes())
        {
            table.firstChild.remove();
        }
        tableFunction(arr);
    }
}

// 2.=>Fetching Contact Data From JSON And Adding to Table List
const getDataFromContact = async () => {
    const url = `http://localhost:3000/contacts`;

    const res = await fetch(url);
    let allContacts = await res.json(); 
    if(!res.ok)
    {
        throw new Error("Error in URL")
    }
    else if(allContacts!=null)
    {
        tableFunction(allContacts)
    console.log("All Contacts:==>");
    console.log(allContacts);
    }
    searchInp.addEventListener("keyup", (e)=>{
        e.preventDefault();
        filterField(allContacts);
        // e.stopPropagation();
        return;
    });

}
getDataFromContact();

//Filter Icon and Filter Click Event
let filterContainer = document.getElementById("filterForLead");

document.getElementById("filterIcon").addEventListener("click", () => {
    if (filterContainer.style.display == "none") {
        filterContainer.style.display = "block"
    }
    else {
        filterContainer.style.display = "none";
    }
});