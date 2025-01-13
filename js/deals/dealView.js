let url=window.location.search;
let param=new URLSearchParams(url);

let currentId=param.get("id");
console.log(currentId);

// Get Table
let table=document.querySelector("table");

// Fetch Current Data From JSON
async function getDealObj(id)
{
    try {
        let result=await fetch(`/mongodb/getById/deals/${id}`);
        let out=await result.json();
        if(result.ok){
            display(out);
        }    
    } catch (error) {
        console.log(error);
    }
}
getDealObj(currentId);

let contactId;
let accountId;
function display(obj)
{
    contactId=obj["contactId"];
    accountId=obj["accountId"];
    console.log(contactId);
    console.log(accountId);
    let name=document.querySelector("#name");
    name.innerHTML=obj["dealName"];
    for (const key in obj)
    {
        if(key=="contactId" || key=="cccountId")
        {
            let cHead=["id", "Contact Name", "Contact Mail", "Organization"];
            let aHead=["id", "AccountName", "AccountMail", "Phone"];
            let contactTable=document.querySelector("#contactInDeal");
            let accountTable=document.querySelector("#accountInDeal");
            continue
        }
        let tr=document.createElement("tr");
        table.appendChild(tr);
        let td1=document.createElement("td");
        let td2=document.createElement("td");
        tr.appendChild(td1);
        td1.classList.add("key");
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
});

async function deleteDeal(id) 
{
    let confirmation=confirm("are you sure? Deleting Deal!");
    if(confirmation)
    {
        try {
            let updateContAcc=await updateContactAndAccount(id);
            console.log(updateContAcc);
            
            // return 
            if(updateContAcc==true)
            {
                console.log("Updated acc and cont --- returned to delete the deal");
                
                let response=await fetch(`/mongodb/delete/deals/${id}`, {
                    method:"DELETE"
                });
                if(!response.ok)
                {
                    throw new Error("Error in URL");
                }
                if(response.ok){
                    alert("Successfully Deleted!");
                    window.location.href=`/html/deals/dealList.html`
                }
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}

// back Button for previous page
let backButton=document.querySelector("#backBtn");
backButton.addEventListener("click", (e)=>{
    e.preventDefault();
    window.history.back();
});

// Edit Deal Details
let editBtn=document.querySelector("#editBtn");
editBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`/html/deals/createDealForm.html?dealToBeEdited=${currentId}`;
});

// Update Contact And Account Details By Deleting the deal id From both the modules
async function updateContactAndAccount(dealId) {
    console.log("Entered into Update method");
    
    try {
        let res=await fetch(`/mongodb/getById/deals/${dealId}`); //getDeal
        if(res.ok){
            console.log("Deal Object fetched to update the contact and account objects");
            
            let dealObj=await res.json();
            let contRes=await fetch(`/mongodb/getById/contacts/${dealObj.contactId}`); //getContacgt
            let accRes=await fetch(`/mongodb/getById/accounts/${dealObj.accountId}`);   //getAccount
            if(contRes.ok && accRes.ok){
                let contObj=await contRes.json();
                let accObj=await accRes.json();
                console.log("Contact & account objects are fetched");
                
                
                //Filter deals Array for Both contact and Account objects
                let cDealArr=filterDealArray(contObj.deals, currentId);
                let aDealArr=filterDealArray(accObj.deals, currentId);

                // set deals Arrays in both contact and account Objects
                contObj.deals=cDealArr;
                accObj.deals=aDealArr;
                console.log("objects to send to put method to update deals");
                
                console.log(contObj);
                console.log(accObj);
            
                let putResContact=await fetch(`/mongodb/update/contacts/${contObj._id}`,{
                    method:"PUT", 
                    // headers:{"Content-Type":"application/json"},
                     body:JSON.stringify(contObj)
                });
                if(!putResContact.ok){
                    throw  new Error("Error in updated Contact:"+ putResContact.status);
                }
                let putResAccount=await fetch(`/mongodb/update/accounts/${accObj._id}`,{
                    method:"PUT",
                    // headers:{"Content-Type":"application/json"},
                     body:JSON.stringify(accObj)
                });
                if(!putResAccount.ok){
                    throw new Error("Error in update account "+putResAccount.status );
                }
                if(putResAccount.ok && putResContact.ok){
                    return true;
                }
                else return false
            }
        }
    } catch (error) {
        
    }
    
}
function filterDealArray(arr, currentId){
    let newArr=arr.filter((id)=>id!=currentId);
    console.log("Filtered Array: "+newArr);
    
    return newArr;
}



