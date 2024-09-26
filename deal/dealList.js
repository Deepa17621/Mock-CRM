let table=document.querySelector("table");
let tableHead=document.querySelector("thead");
let tableBody=document.querySelector("tbody");

let arr=[];
let selField;
// search Deal
function selectField()
{
     selField=document.querySelector("#fields").value;

}
let searchField=document.querySelector("#searchField");

// create Deal Button
const createDealBtn=document.querySelector("#createDealBtn");
createDealBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href='/deal/createDealForm.html';
})

// Fetch From Json
async function fetchData()
{
    let result=await fetch("http://localhost:3000/deals");
    let arrOfObj=await result.json();

    sendToTable(arrOfObj); 
    searchField.addEventListener("keyup",(e)=>{
        e.preventDefault();
        filterFunction(arrOfObj);
    });
       
}
fetchData();

// Filter Function

function filterFunction(arrOfObjs)
{
    arrOfObjs.forEach(e=>{
        if((e[selField]).toLowerCase()==(searchField.value).toLowerCase())
        {
            arr.push(e);
        }
    });
    if(arr.length>0)
    {
        while(table.hasChildNodes())
        {
            table.firstChild.remove();
        }
    }
    sendToTable(arr);
}

function sendToTable(obj)
{
    let header=Object.keys(obj[0]);
    let thead=document.createElement("tr");
    tableHead.appendChild(thead);
    header.forEach(e=>{
        let th=document.createElement("th");
        th.innerHTML=e;
        thead.appendChild(th);
    });
    console.log(obj);
    
    obj.forEach(e => 
    {
        let item=(Object.keys(obj[0]))[Symbol.iterator]();
        let tr=document.createElement("tr");
        tr.id=e["id"];
        tr.setAttribute("onclick", "rowClicked(this.id)")
        tableBody.appendChild(tr);
        for (const key in e)
        {        
            let val=item.next().value;
            let td=document.createElement("td");
            td.className=val;
            td.innerHTML=e[td.className];
            tr.appendChild(td);
        }
    });
}

// Row Clicked Event

 async function rowClicked(id)
{
    window.location.href=`/deal/dealView.html?id=${id}`;
}
