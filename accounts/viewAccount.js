let url=window.location.search;
let param=new URLSearchParams(url);
let currentId=param.get("id");
console.log(currentId);

let accTable=document.getElementById("accTable");
function displayAcc(obj)
{
    for (const key in obj) {
        if(key=="Contacts"|| key=="deals")
        {
            continue
        }
        let tr=document.createElement("tr");
        accTable.appendChild(tr);
        let td1=document.createElement("td");
        tr.appendChild(td1);
        td1.innerHTML=key.toUpperCase();
        let td2=document.createElement("td");
        tr.appendChild(td2);
        td2.innerHTML=obj[key];
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