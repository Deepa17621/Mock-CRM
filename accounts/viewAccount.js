let url=window.location.search;
let param=new URLSearchParams(url);
let currentId=param.get("id");
console.log(currentId);
let mailButton=null;
let accTable=document.getElementById("accTable");
let contactTable=document.getElementById("contactsInAcc");
function displayAcc(obj)
{
    for (const key in obj) {
        if(key=="Contacts"|| key=="deals")
        {
            if(key=="Contacts")
            {
                let thead=document.createElement("tr");
                contactTable.appendChild(thead);
                let td1=document.createElement("th");
                thead.appendChild(td1);
                td1.innerHTML="Contact Name";
                let td2=document.createElement("th");
                thead.appendChild(td2);
                td2.innerHTML="Contact Mail";
                let td3=document.createElement("th");
                thead.appendChild(td3);
                td3.innerHTML="Contact Phone";
                let headArr=["Contact Name", "Contact Mail", "Phone"];
                obj[key].forEach(e => {
                    fetchContactToAcc(e, headArr); 
                });
            }
            // else if("deals")
            // {
            //     key.forEach(e=>fetchContactToAcc(e));
            // }
        }
        else {
            let tr=document.createElement("tr");
            accTable.appendChild(tr);
            let td1=document.createElement("td");
            tr.appendChild(td1);
            let td2=document.createElement("td");
            tr.appendChild(td2);
            td1.innerHTML=key.toUpperCase();
            if(key=="AccountMail")
            {
                td2.innerHTML=`<a href="mailto:${obj[key]}">${obj[key]}</a>`;
                mailButton=obj[key];
                continue
            }
            else if(key=="Phone")
            {
                td2.innerHTML=`<a href="tel:${obj[key]}">${obj[key]}</a>`;
                continue
            }
            td2.innerHTML=obj[key];
        }
    }
}
// Fetch Account Data From JSON
async function fetchAcc(id)
{
    let res=await fetch(`http://localhost:3000/accounts/${currentId}`); 
    let out=await res.json();
    displayAcc(out); 
}

fetchAcc(currentId);

function rowClicked(id)
{
    window.location.href=`http://127.0.0.1:5500/contact/contactView.html?id=${id}`;
}

// Fetch Contact Details To Accounts Module
async function fetchContactToAcc(id, arr)
{
    let res=await fetch(`http://localhost:3000/contacts/${id}`);
    let out=await res.json();
    let iterator=arr[Symbol.iterator]();
    let tr=document.createElement("tr");
    contactTable.appendChild(tr);
    tr.setAttribute("id", id);
    tr.setAttribute("onclick", "rowClicked(this.id)");
    for (const key in out)
    {
        if(key.includes(arr))
        {
            let val=iterator.next().value;
            let td=document.createElement("td");
            tr.appendChild(td);
            td.className=val;
            td.innerHTML=out[td.className];
        }
    }
}

// Edit Button Event
let editBtn=document.querySelector("#editBtn");
editBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`http://127.0.0.1:5500/accounts/editAccount.html?id=${currentId}`;
});

// Delete Btn Event

let deleteBtn=document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    if(window.confirm("Are You Sure delete??"))
    {
        window.location.href=`http://127.0.0.1:5500/accounts/accountList.html`;
        deleteAcc(currentId);
        window.alert("Account Deleted Successfully")
    }
    e.stopPropagation();
});

async function deleteAcc(id)
{
    let res=await fetch(`http://localhost:3000/accounts/${id}`,{
        method:"DELETE", 
        headers:{"Content-Type":"application/json"}
    });
    let out=await res.json(); 
    return out;
}

// send Mail Button
let mailBtn=document.querySelector("#mail");
mailBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    mailBtn.setAttribute("href", `mailto:${mailButton}`);

});


