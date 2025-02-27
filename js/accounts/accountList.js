// Get Table using DOM
let table = document.querySelector("table");
let tHead = document.querySelector("thead");
let tBody = document.querySelector("tbody");

// create Account Button Event
const createAccount = document.querySelector("#btn-create-acc");

createAccount.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/html/accounts/createAccount.html`;
})

// search Account
let inpForSearch = document.querySelector("#searchAccount");
let selOption;
let arr = [];
function selField()
{
     selOption = document.querySelector("#lookupForLead").value;
}
function filterField(arrOfObjs)
{
    arrOfObjs.forEach((ele)=>{
        if((ele[`${selOption}`].toLowerCase()) == ((inpForSearch.value).toLowerCase())){
             console.log("true");
             arr.push(ele);
             console.log(ele);
             return;
        } 
    });
    if(arr.length > 0){
        while(tHead.hasChildNodes())
        {
            tHead.firstChild.remove();
        }
        while(tBody.hasChildNodes()){
            tBody.firstChild.remove();
        }
        addToTable(arr);
    }
}
// Fetch All the Accounts From JSON
async function getAllAccounts() {
    let res = await fetch("/mongodb/getAll/accounts");
    let allAccounts = await res.json();
    
    // Function Call To Add All the Details To Table
    addToTable(allAccounts);
    inpForSearch.addEventListener("keyup", (e) => {
        e.preventDefault();
        filterField(allAccounts);
        return;
    });
}

function addToTable(allAccs)
{
    // Create Iterator
    let obj_0 = allAccs[0];
    let iteratorArr = ["accountOwner","accountName", "phone", "accountMail"];
    let tableHead = ["accountOwner", "accountName", "phone", "mail"];
    // table header
    let thead = document.createElement("tr");
    tHead.appendChild(thead);
    thead.style.position="sticky";
    //CheckBox
    let checkBox = document.createElement("th");
    checkBox.innerHTML = `<input type="checkBox">`;
    thead.appendChild(checkBox);
    tableHead.forEach(e=>{
        let th = document.createElement("th");
        let span = document.createElement("span");
        th.appendChild(span);
        span.innerHTML = e;
        thead.appendChild(th);
    });

    //table body
    allAccs.forEach(obj=>{
        let iterator1 = iteratorArr[Symbol.iterator]();

        let row = document.createElement("tr");
        row.id = obj["_id"];
        // row.setAttribute("onclick", "rowClickedEvent(this.id)");
        tBody.appendChild(row);
        let checkBox21 = document.createElement("td");
        row.appendChild(checkBox21);
        checkBox21.innerHTML = `<input type="checkbox">`;
        let colCount = 0;
        for (const key in obj) {
           let val = iterator1.next().value;
           if(val == null) return;

           let tdata = document.createElement("td");
           let span = document.createElement("span");
           tdata.appendChild(span);
           tdata.className = val;
           row.appendChild(tdata);

           if(colCount<4){
            colCount++;
           }
           if(val == "accountMail")
           {
               span.innerHTML = `<a href="mailto:${obj[tdata.className]}">${obj[tdata.className]}</a>`;
           }
           else if(val == "phone")
           {
               span.innerHTML = `<a href="tel:${obj[tdata.className]}">${obj[tdata.className]}</a>`
           }
           else{
                if(val == "accountName"){
                    span.addEventListener("click", (e)=>{
                        e.preventDefault();
                        window.location.href = `/html/accounts/viewAccount.html?id=${obj._id}`;
                    });
                    span.style.cursor = "pointer";
                }
               span.innerHTML = obj[tdata.className];
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
getAllAccounts();

// Filter Icon and Filter Click Event
let filterContainer=document.getElementById("container-filter-acc");

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