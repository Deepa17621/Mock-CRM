let url=window.location.search;
let param=new URLSearchParams(url);


let currentId=param.get("id");
console.log(currentId);

// Get Table
let table=document.querySelector("table");

// Fetch Current Data From JSON
async function fetchData(id)
{
    let result=await fetch(`http://localhost:3000/deals/${id}`);
    let out=await result.json();
    display(out);    
}
fetchData(currentId);

function display(obj)
{
    let name=document.querySelector("#name");
    name.innerHTML=obj["DealName"];
    for (const key in obj)
    {
        let tr=document.createElement("tr");
        table.appendChild(tr);
        let td1=document.createElement("td");
        let td2=document.createElement("td");
        tr.appendChild(td1);
        tr.appendChild(td2);
        td1.innerHTML=key;
        td2.innerHTML=obj[key];
    }

}

// Delete Button
let deleteBtn=document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    deleteDeal(currentId);
    window.location.href=`http://127.0.0.1:5500/deal/dealList.html`;
    
});

async function deleteDeal(id) 
{
    let response=await fetch(`http://localhost:3000/deals/${id}`, {
        method:"DELETE"
    });

}



