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
    let result=await fetch("/mongodb/getAll/deals");
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
        if((e[selField])==(searchField.value))
        {
            arr.push(e);
        }
    });
    if(arr.length>0)
    {
        
        while(tableHead.hasChildNodes())
        {
            tableHead.firstChild.remove();
        }
        while(tableBody.hasChildNodes()){        
             tableBody.firstChild.remove();
        }

    }
    sendToTable(arr);
}

function sendToTable(obj)
{
    let header=["dealName", "amount","stage", "accountName","contactName","closingDate", "dealOwner"];
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
        let item=header[Symbol.iterator]();
        let tr=document.createElement("tr");
        tr.id=e["id"];
        // tr.setAttribute("onclick", "rowClicked(this.id)")
        tableBody.appendChild(tr);
        for (const key in e)
        {        
            let val=item.next().value;
            if(!val){
                return;
            }
            let td=document.createElement("td");
            td.className=val;
            if(val=="dealName")
            {
                td.setAttribute("onclick", `rowClicked("${e["_id"]}")`);
                td.style.cursor="pointer";
            }
            td.innerHTML=e[td.className];
            tr.appendChild(td);
        }
    });
}

// Select View -- KambanView / List View
let selectOption=document.querySelector("#selectView");


// Row Clicked Event
 async function rowClicked(id)
{
    window.location.href=`/deal/dealView.html?id=${id}`;
}

// Change View From List To Kamban
let selectView=document.querySelector("#selectView");
selectView.addEventListener("change", (e)=>{
    e.preventDefault();
    if(selectView.value=="listView")
    {
        window.location.href=`./dealList.html`;
    }
    else if(selectView.value=="kambanView")
    {
        window.location.href=`./dealKambanView.html`
    }
});
