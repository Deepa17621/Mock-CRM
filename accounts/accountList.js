// Get Table using DOM
let table=document.querySelector("table");


// search Account
let inpForSearch=document.querySelector("#searchAccount");
let selOption;
let arr=[];
function selField()
{
     selOption=document.querySelector("#lookupForLead").value;
}
function filterField(arrOfObjs)
{
    
    arrOfObjs.forEach((ele)=>
    {
        // console.log(ele[`${selectField}`]);
        if((ele[`${selOption}`].toLowerCase())==((inpForSearch.value).toLowerCase()))
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
        addToTable(arr);
    }
}
// Fetch All the Accounts From JSON
async function getAllAccounts() 
{
    let res=await fetch("http://localhost:3000/accounts");
    let allAccounts=await res.json();
    
    // Function Call To Add All the Details To Table
    addToTable(allAccounts);
    inpForSearch.addEventListener("keyup", (e)=>{
        e.preventDefault();
        filterField(allAccounts);
        return;
    });
}

function addToTable(allAccs)
{
    // Create Iterator
    let obj_0=allAccs[0];
    let iteratorArr=["AccountOwner","AccountName", "Phone", "AccountMail"];
    let tableHead=["Account Owner", "Account Name", "Phone", "Mail"];
    // table header
    let thead=document.createElement("tr");
    table.appendChild(thead);
    thead.style.position="sticky";
    //CheckBox
    let checkBox=document.createElement("th");
    checkBox.innerHTML=`<input type="checkBox">`;
    thead.appendChild(checkBox);
    tableHead.forEach(e=>{
        let th=document.createElement("th");
        th.innerHTML=e.toUpperCase();
        thead.appendChild(th);
    });

    //table body
    allAccs.forEach(obj=>{
        let iterator1=iteratorArr[Symbol.iterator]();

        let row=document.createElement("tr");
        row.id=obj["id"];
        row.setAttribute("onclick", "rowClickedEvent(this.id)");
        table.appendChild(row);
        let checkBox21=document.createElement("td");
        row.appendChild(checkBox21);
        checkBox21.innerHTML=`<input type="checkbox">`;
        
        
        for (const key in obj) 
        {
           let val=iterator1.next().value;
           if(val==null) return;
           let tdata=document.createElement("td");
           tdata.className=val;
           row.appendChild(tdata)
           if(val=="Account Mail")
           {
               tdata.innerHTML=`<a href="mailto:${obj[tdata.className]}">${obj[tdata.className]}</a>`;
           }
           else if(val=="Phone")
           {
               tdata.innerHTML=`<a href="tel:${obj[tdata.className]}">${obj[tdata.className]}</a>`
           }
           else{
               tdata.innerHTML=obj[tdata.className];
           }
        }
    });

    
}
getAllAccounts();
function rowClickedEvent(id)
{
    window.location.href=`http://127.0.0.1:5500/accounts/viewAccount.html?id=${id}`;
}