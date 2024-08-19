let url=window.location.search;
let param=new URLSearchParams(url);
let currentId=param.get("id");
console.log(currentId);

async function getData()
{
    let url="http://localhost:3000/contacts/";
    let res=await fetch(url+currentId);
    // console.log(res);
    
    let obj=await res.json();
    createTable(obj);
    
}
let email;
function createTable(data)
{
    let name=document.getElementById("name");
    name.innerHTML=data["Contact Name"];
    let tbl=document.querySelector("#view");
    for (const key in data) 
    {
        if(key=="Contact Mail") {
            email=data[key];
            let tr=document.createElement("tr");
            tbl.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
            td1.textContent=key;
            td2.innerHTML=`<a href="mailto:${data[key]}">${data[key]}</a>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        if(key==="Phone")
        {
            let tr=document.createElement("tr");
            tbl.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
            td1.textContent=key;
            td2.innerHTML=`<a href="tel:${data[key]}">${data[key]}</a>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        let row=document.createElement("tr");
        tbl.appendChild(row);
        let td=document.createElement("td");
        td.innerHTML=key.toUpperCase();
        row.appendChild(td);
        let td2=document.createElement("td");
        td2.innerHTML=data[key];
        row.appendChild(td2);
    }
}
// 1. Flow-1
getData();

// Send Mail Button Event
let mailBtn=document.querySelector("#mailBtn");
mailBtn.addEventListener("click",()=>{
    mailBtn.children[0].href=`mailto:${email}`;
});

// Convert contact Button

