let table=document.querySelector("table");

let arr=[];
let selField;
// search Deal
function selectField()
{
     selField=document.querySelector("#fields").value;

}
let searchField=document.querySelector("#searchField");

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
    table.appendChild(thead);
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
        table.appendChild(tr);
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
    window.location.href=`http://127.0.0.1:5500/deal/dealView.html?id=${id}`;
}
