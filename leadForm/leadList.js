//Script to Display All Leads.

let table=document.querySelector("table");
let tableHead=document.querySelector("thead");
let tableBody=document.querySelector("tbody");

function rowClickFunction(row)
{
        let idValue=row;
        console.log(idValue);
        window.location.href=`/leadForm/leadView.html?id=${idValue}`;  
}

// Create Lead - Button
const createLeadBtn=document.querySelector("#createLeadBtn");

createLeadBtn.addEventListener("click",e=>{
    e.preventDefault();
    window.location.href=`/leadForm/leadForm.html`
});

// SEARCH -Search Lead 
var selectField;
let arr=[];
function selField()
{
    selectField=document.querySelector("#lookupForLead").value;
    console.log(selectField);
}
//Display Table Function
function tableFunction(collectionOfObjs)
{
    let thead=document.createElement("tr");
    tableHead.appendChild(thead);
    //Table Head
    let firstObj=collectionOfObjs[0];
    console.log(Object.keys(firstObj));
    
    let headForTable=Object.keys(firstObj);

    //This is for Table Head
    let checkBoxTd=document.createElement("td");
    checkBoxTd.innerHTML=`<input type="checkbox">`;
    thead.appendChild(checkBoxTd);
    headForTable.forEach(e=>{
        let td=document.createElement("th");
        td.innerHTML=e;
        thead.appendChild(td);
    });

    // Fetching Single Object From Group of Objects-Using For Each
    collectionOfObjs.forEach(e => { 

        //Making Iterator  
        let head=headForTable[Symbol.iterator]();

        let trow=document.createElement("tr");
        tableBody.appendChild(trow);
        trow.id=e["_id"];
        // trow.setAttribute("onclick", `rowClickFunction(this.id)` );        
        let checkBoxtd=document.createElement("td");
        checkBoxtd.innerHTML=`<input type="checkbox">`;
        trow.appendChild(checkBoxtd);
        
        // One Row Of Data
        for (const key in e) 
        {
            let val=head.next().value;

            let tdata=document.createElement("td");
            tdata.className=val;
            trow.appendChild(tdata);
            if(val=="Lead Mail" )
            {
                tdata.innerHTML=`<a href=mailto:${e[tdata.className]}>${e[tdata.className]}`;
            }
            else if(val =="Phone")
            {
                tdata.innerHTML=`<a href=tel:${e[tdata.className]}>${e[tdata.className]}`;
            }
            else{
                if(val=="Lead Name")
                    {
                        tdata.setAttribute("onclick", `rowClickFunction(${e._id})` );
                        tdata.style.cursor="pointer";
                    }
                tdata.innerHTML=e[tdata.className];
            }

        }
        
    });

}
let inpForSearch=document.querySelector("#searchLead");
function filterField(collectionOfObjs)
{
    
    collectionOfObjs.forEach((ele)=>
    {
        // console.log(ele[`${selectField}`]);
        if((ele[`${selectField}`].toLowerCase())==((inpForSearch.value).toLowerCase()))
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



const getAllLeads=async()=>
{
    let res=await fetch('/getAll/lead');
    let collectionOfObjs=await res.json();
    tableFunction(collectionOfObjs);
    inpForSearch.addEventListener("keyup",(e)=>{
        e.preventDefault();
        filterField(collectionOfObjs);
        e.stopPropagation();
        return;
    });
}
getAllLeads();


// Filter Icon and Filter Click Event
let filterContainer=document.getElementById("filterForLead");

document.getElementById("filterIcon").addEventListener("click",()=>
{
    if(filterContainer.style.display=="none")
    {
        filterContainer.style.display="block"
    }
    else
    {
        filterContainer.style.display="none";
    }
});