// 1=> If Contact Converted From Lead Means-->Get Url.
let url = window.location.search;
let param = new URLSearchParams(url);
let currentId = param.get("id");

console.log("Current Id From Contact List :");
console.log(currentId);

// Getting table
let table = document.querySelector("table");
let tableHead=document.querySelector("thead");
let tableBody=document.querySelector("tbody");

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
    window.location.href='/html/contacts/contactForm.html';
})

// lead to contact=>del from lead add to contact
function sendToContact(contact, lead) {
    try {
        let del = deleteLead(lead);
        fetch(`/mongodb/post/contacts/`, {
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
async function deleteLead(lead) {
    try {
        let res=await fetch(`/mongodb/delete/leads/${lead}`, {
            method: "DELETE",
            headers: { "Content-Type": "applicatio/json" }
        });
        if(res.ok){
            let response=await res.json();
        }
        else throw new Error("Error: "+ res.status)
    } catch (error) {
    }
}
// Fetch for getting the converted data from Lead
const fetchDataFromLead = async () => {
let convert = JSON.parse(localStorage.getItem("convert"));
console.log(convert);

    try {
        if(convert === true){
            alert("Convert Success");
            JSON.stringify(localStorage.setItem("convert", "false"));
            return;
        }
        let URL = `/mongodb/getById/leads/${param.get("id")}`
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
                    obj["_id"] = respo[key];
                    break;
                case "contactName":
                    obj["contactName"] = respo[key];
                    break;
                case "contaactMail":
                    obj["contactMail"] = respo[key];
                    break;
                case "phone":
                    obj["phone"] = respo[key];
                    break;
                case "address":
                    obj["address"] = respo[key];
                    break;
                case "organization":
                    obj["organization"] = respo[key];
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

function tableFunction(allContacts)
{
    let keyArr=["contactName", "contactMail", "phone", "address", "organization"];
    //Table Head
    let thead=document.createElement("tr");
    tableHead.appendChild(thead);
    let thForCheckBox=document.createElement("th");
    thForCheckBox.innerHTML=`<input type="checkbox">`
    thead.appendChild(thForCheckBox);
    keyArr.forEach(e=>{
        let thh=document.createElement("th");
        let span=document.createElement("span");
        span.innerHTML=e.toUpperCase();
        thead.appendChild(thh);
        thh.appendChild(span);
    });

    // Table body 
    allContacts.forEach(obj=>{

        //iterator for same order insertion of data.
         let iterator1=keyArr[Symbol.iterator]();
        
         let row=document.createElement("tr");
         row.id=obj["_id"];
        //  row.setAttribute("onclick", "rowClickedEvent(this.id)");
         tableBody.appendChild(row);
         let checkBox21=document.createElement("td");
         row.appendChild(checkBox21);
         checkBox21.innerHTML=`<input type="checkbox">`;
         let colCount=0;
         
         for (const key in obj) 
         {
            let val=iterator1.next().value;
            let tdata=document.createElement("td");
            tdata.className=val;
            row.appendChild(tdata);
            let span=document.createElement("span");
            tdata.appendChild(span);
            if(colCount<5)
            {
                colCount++;
            }
            else return
            if(val=="contactMail")
            {
                span.innerHTML=`<a href="mailto:${obj[tdata.className]}">${obj[tdata.className]}</a>`;
            }
            else if(val=="phone")
            {
                span.innerHTML=`<a href="tel:${obj[tdata.className]}">${obj[tdata.className]}</a>`
            }
            else{
                if(val=="contactName")
                    {
                        span.addEventListener("click", (eve)=>{
                            eve.preventDefault();
                            window.location.href=`/html/contacts/contactView.html?id=${obj._id}`;
                        })
                        span.style.cursor="pointer";
                    }
                span.innerHTML=obj[tdata.className];
            }
         }
    })
}

// Filter data From JSON To Display

function filterField(arrOfObjs)
{
    arrOfObjs.forEach((ele)=>
    {
        if((ele[`${option}`].toLowerCase())==((searchInp.value).toLowerCase()))
         {
             console.log("true");
             arr.push(ele);
             console.log(ele);
             return;
         } 
    });
    if(arr.length > 0)
    {
        while(tableHead.hasChildNodes())
        {
            tableHead.firstChild.remove();
        }
        while(tableBody.hasChildNodes()){
            tableBody.firstChild.remove();
        }
        tableFunction(arr);
    }
}

// 2.=>Fetching Contact Data From JSON And Adding to Table List
const getAllContacts = async () => {
    const res = await fetch(`/mongodb/getAll/contacts`);
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
getAllContacts();

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