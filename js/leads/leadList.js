//Script to Display All Leads.
let table=document.querySelector("table");
let tableHead=document.querySelector("thead");
let tableBody=document.querySelector("tbody");

// Create Lead - Button
const createLeadBtn=document.querySelector("#createLeadBtn");

createLeadBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    window.location.href=`/html/leads/leadForm.html`
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
    let headForTable=["firstName","lastName", "email", "phone", "date", "leadOwner"];
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
        let head=headForTable[Symbol.iterator]();
        let trow=document.createElement("tr");
        tableBody.appendChild(trow);
        trow.id=e["_id"];
        let checkBoxtd=document.createElement("td");
        checkBoxtd.innerHTML=`<input type="checkbox" name="" id="${e._id}">`;
        trow.appendChild(checkBoxtd);
        let colCount=0;
        
        // One Row Of Data
        for (const key in e) 
        {
            let val=head.next().value;
            if(colCount<=5){
                colCount++;
            }
            else return;

            let tdata=document.createElement("td");
            let span=document.createElement("span");
            tdata.appendChild(span);
            tdata.className=val;
            trow.appendChild(tdata);
            if(val=="email" )
            {
                span.innerHTML=`<a href=mailto:${e[tdata.className]}>${e[tdata.className]}`;
            }
            else if(val =="phone")
            {
                span.innerHTML=`<a href=tel:${e[tdata.className]}>${e[tdata.className]}`;
            }
            else{
                if(val=="firstName")
                    {
                        span.addEventListener("click", (event)=>{
                            event.preventDefault();
                            window.location.href=`/html/leads/leadView.html?id=${e._id}`;
                        });
                        span.style.cursor="pointer";
                    }
                span.innerHTML=e[tdata.className];
            }

        }
        
    });
    let allCheckBoxes = document.querySelectorAll(`input[type="checkbox"]`);
    allCheckBoxes.forEach(element => {
        element.addEventListener("change", (e)=>{
            const row = element.closest('tr');
            if(row.closest("thead")){
                if(element.checked){
                    allCheckBoxes.forEach(element=>{
                        let rw = element.closest("tr");
                        rw.classList.add("selected");
                        element.checked=true;
                    })
                }
                else{
                    allCheckBoxes.forEach(element=>{
                        let rw = element.closest("tr");
                        rw.classList.remove("selected");
                        element.checked=false;
                    })
                }
            }
            if (element.checked) {
            row.classList.add('selected');
            } else {
            row.classList.remove('selected');
            }          
        })
    });

}
let inpForSearch=document.querySelector("#searchLead");
function filterField(collectionOfObjs)
{
    collectionOfObjs.forEach((ele)=>
    {
        // console.log(ele[`${selectField}`]);
        if((ele[`${selectField}`].toLowerCase()) === ((inpForSearch.value).toLowerCase()))
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
    let res=await fetch('/mongodb/getAll/leads');
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
let date = new Date();
console.log(date.toDateString());
