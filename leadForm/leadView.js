let url=window.location.search;
console.log(url);
let param=new URLSearchParams(url);
let identity=param.get("id");
console.log(identity);

// This is For Display the Clicked Lead Detail
function displayData(obj)
{    
    let mail=null, name=null;
    console.log(obj);
    
    let table=document.querySelector("#view");
    for (const key in obj)
    {
        if(key=="Lead Mail")
        {
            mail=obj[key];
            let tr=document.createElement("tr");
            table.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
            td1.textContent=key;
            td2.innerHTML=`<a href="mailto:${obj[key]}">${obj[key]}</a>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        if(key==="Phone")
        {
            let tr=document.createElement("tr");
            table.appendChild(tr);
            let td1=document.createElement("td");
            let td2=document.createElement("td");
            td1.textContent=key;
            td2.innerHTML=`<a href="tel:${obj[key]}">${obj[key]}</a>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            continue
        }
        if(key=="Lead Name")
        {
            name=obj[key];
        }
        
        let tr=document.createElement("tr");
        table.appendChild(tr);
        let td1=document.createElement("td");
        let td2=document.createElement("td");
        td1.textContent=key;
        td2.textContent=obj[key];
        tr.appendChild(td1);
        tr.appendChild(td2);
    }
    let mailBtn=document.getElementById("mail");
    mailBtn.setAttribute("href", `mailto:${mail}`);
    document.getElementById("name").innerHTML=`${name}`;
}

const clickedDataFetch=async()=>{
    let id=param.get("id");
    console.log(id);
    
    let url=`http://localhost:3000/leads/`
     const res=await fetch(url+id);
     const data=await res.json();
     displayData(data);
}

clickedDataFetch();

// Edit Button- Click to Edit the Lead Details
let editBtn=document.getElementById("editBtn");
console.log(editBtn);

editBtn.addEventListener("click", ()=>{
    window.location.href=`http://127.0.0.1:5500/leadForm/editLeadForm.html?id=${identity}`;
   
});


// Convert Lead To Other Modules Event
let convertBtn=document.querySelector("#convert");

convertBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    document.querySelector("#popupContainer").style.display="flex";
    e.stopPropagation();
});

// Cancel From Pop-Up
let cancelPopup=document.querySelector("#popupCancel");
    cancelPopup.addEventListener("click", (e)=>{
        e.preventDefault();
        document.querySelector("#popupContainer").style.display="none";
    });

    //convertForm
let convertForm=document.querySelector("form");

// Only Contact
let convertOk=document.querySelector("#convertOk");
convertOk.addEventListener("click", (e)=>{
    // e.preventDefault();
    convertForm.requestSubmit();
});


convertForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let contactOnly=document.querySelector("#contactOnly");
    if(contactOnly.checked)
    {
        document.querySelector("#popupContainer").style.display="none";
        window.location.href=`http://127.0.0.1:5500/contact/contactList.html?id=${identity}`;
        alert("Converted Successfully");
    }
})

async function del(id)
{
        let res=await fetch(`http://localhost:3000/leads/${id}`, {
            method:"DELETE"
        });
        let out=res.json();
}

let deleteBtn=document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    del(identity);
    window.location.href=`http://127.0.0.1:5500/leadForm/leadList.html`;
    e.stopPropagation();
});



