let outerWrapper = document.querySelector(".outerWrapper");

async function getAllFolders() {
    try {
        let res = await fetch(`/mail/getFoldersList`);
        if(res.ok){
            let folders=await res.json();
            await sidebar(folders); // step-2
        }
        else{
            throw new Error("Error in Get All Folders Fetch - "+res.status);
        }

    } catch (error) {
        console.log(error);
    }
}

// Step - 1
getAllFolders(); // Execution Starts From Here...

async function sidebar(allFolders){
    let sideBar=document.createElement("div");
    sideBar.setAttribute("class", "sideBarContainer")
    let sideBarHtml = `<button class="composeMailBtn" onclick="composeMail()">New Mail - Compose <i class="fa-solid fa-pen"></i> </button>`
    let foldersArray=allFolders.data;
    foldersArray.forEach(f1 => {
        sideBarHtml += `<div id="${f1.folderId}" class="btnForFolders" onclick="getListOfMail(this.id)">${f1.folderName}</div>`;
    });
    sideBar.innerHTML = sideBarHtml
    outerWrapper.appendChild(sideBar);
}

// step - 3
async function getListOfMail(folderId) {

    try {
        let response = await fetch(`/mail/getListOfEmails/${folderId}`, {
            method : "GET"
        });
        if (response.ok) {
            let mailList = await response.json();           
            await displayListOfMail(mailList.data); // step - 4
        }
        else {
            throw new Error(response.status + " " + response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

// step - 5
 async function displayListOfMail(mailList) {

    let existingElement = document.querySelector(".aside");

    if(document.querySelector(".displayContainer")){
        (document.querySelector(".displayContainer")).remove();
    }
    if( existingElement ){
        existingElement.remove();
    }
    if(document.querySelector(".newMailContainer")){
        (document.querySelector(".newMailContainer")).remove();
    }
    console.log(mailList);

    let wrapperForMailList = document.createElement("div");
    wrapperForMailList.setAttribute("class", "aside");
    outerWrapper.appendChild( wrapperForMailList );

    let classA=document.querySelector(".styleForEmpty");

    if(mailList.length==0){
        let emptyPageContent = `<div class= "emptyContainer"> <b> No messages found in this folder</b></div>`;
        wrapperForMailList.innerHTML=emptyPageContent;
        wrapperForMailList.classList.add("styleForEmpty");
    }
    else if(classA){
        classA.classList.remove(".styleForEmpty");
    }
    let topForMailList = `<div> <div> <input type="checkbox" name="" class="overAllCheckBox"> <span><span></div></div><hr>`
    mailList.forEach(mail => {

        let li = document.createElement("div");
        li.setAttribute("class", "list");
        li.addEventListener("click", (e)=>{  //step - 6
            e.preventDefault();
            if(document.querySelector(".displayContainer")){
                (document.querySelector(".displayContainer")).remove();
            }
            displayMail(mail.folderId, mail.messageId);
        })
        let htm = `
                    <div class="selOption" id="${mail.messageId}"><input type="checkbox" name="" id="${mail.messageId}" class="check"></div>
                    <div class="mailIcon"><i class="fa-regular fa-envelope"></i></div>
                    <div class = "listt" id=${mail.messageId}>
                        <span class="span"><b>${mail.sender}</b></span>
                        <span class="span">${mail.subject}</span>
                    </div>
                  `
        li.innerHTML = htm;
        wrapperForMailList.appendChild(li);
    });
 }
// step - 7
 async function displayMail(folderId, messageId){
    let mailContent = await getMailContent(folderId, messageId);
    console.log(mailContent.data.content);
    
    if(mailContent){
        let displayContainer = document.createElement("section");
        displayContainer.setAttribute("class", "displayContainer");
        displayContainer.innerHTML = mailContent.data.content;
        outerWrapper.appendChild(displayContainer);
        
    }
 }
// step - 8
 async function getMailContent(folderId, messageId) {
    try {
        let response = await fetch(`/mail/displayMail/${folderId}/${messageId}`, {
            method : "GET"
        });
        if(response.ok){
            let mailContent = await response.json();
            return mailContent;
        }
        else return null;
    } catch (error) {
        console.log(error);
    }
 }

 // step - 9 
 async function composeMail() {
    let existingElement = document.querySelector(".aside");

    if(document.querySelector(".displayContainer")){
        (document.querySelector(".displayContainer")).remove();
    }
    if( existingElement ){
        existingElement.remove();
    }

    let newMailContainer = document.createElement("div");
    newMailContainer.setAttribute("class", "newMailContainer");

    let newMailForm = newMailFormStructure();  // step - 10

    newMailContainer.innerHTML = newMailForm;
    if(!(document.querySelector(".newMailContainer"))){
        outerWrapper.appendChild(newMailContainer);
    }
    
    attachFormSubmitListner();
    
 }

 function newMailFormStructure(){

                return `
                        <form class="composeMailForm">
                            <div class="headerForMail"><div class="sendMailBtn" title="send mail" onclick="sendMail(this.parentElement)"> <i class="fa-regular fa-paper-plane" style="color: #2c66dd;"></i> Send</div></div>
                            <div class="form-Group">
                                <label for="fromAddress">From</label>
                                <input type="email" name="fromAddress" id="fromAddress" class="inps">
                            </div>
                            <div class="form-Group">
                                <label for="toAddress">To</label>
                                <input type="email" name="toAddress" id="toAddress" class="inps">
                            </div>
                            <div class="form-Group">
                                <label for="ccAddresses">cc</label>
                                <input type="email" name="ccAddresses" id="ccAddresses" class="inps">
                            </div>
                            <div class="form-Group">
                                <label for="bccAddress">bcc</label>
                                <input type="email" name="bccAddress" id="bccAddress" class="inps">
                            </div>
                            <div class="form-Group">
                                <input type="text" name="subject" id="subject"  class="inps" placeholder="Subject">
                            </div>
                            <div class="middleBar">
                                <span title="attach file here"><i class="fa-solid fa-paperclip attachFile"></i></span>-attach file
                            </div>
                            <div class="form-Group">
                                <textarea name="message" id="message"  class="txtArea"></textarea>
                            </div>
                        </form>`
 }
async function sendMail(form){

    var mailForm = document.querySelector(".composeMailForm");
    console.log(mailForm);

    // mailForm.requestSubmit();   
    mailForm.requestSubmit();
}
function attachFormSubmitListner(){
    let form = document.querySelector(".composeMailForm");
    if(form){
        form.addEventListener("submit", async(e)=>{
             
            e.preventDefault();
        
            let fromAddress = document.querySelector("#fromAddress");
            let toAddress   = document.querySelector("#toAddress");
            let ccAddresses = document.querySelector("#ccAddresses");
            let bccAddresses= document.querySelector("#bccAddress");
            let subject     = document.querySelector("#subject");
            let mailContent = document.querySelector("#message");
        
            if(!fromAddress.value || !toAddress.value){
                !fromAddress.value ? setError(fromAddress) : setSuccess(fromAddress);
                !toAddress.value ? setError(toAddress) : setSuccess(toAddress);
                return ;
            }
        
            const requestBody = {
                "fromAddress" : fromAddress.value,
                "toAddress"   : toAddress.value,
                "ccAddress"   : ccAddresses.value,
                "bccAddress"  : bccAddresses.value,
                "subject"     : subject.value,
                "content"     :  mailContent.value,
                // "attachments": [
                //     {
                //         "storeName": "NN2:-167775813820412438",
                //         "attachmentPath": "/1425407266885_ourholidays",
                //         "attachmentName": "ourholidays.jpg"
                //     }
                // ]
            }
        
            console.log(requestBody);
            
            let response = await fetch(`/mail/sendMail`, {
                method : "POST", 
                body : JSON.stringify(requestBody),
                headers: {"Content-Type":"application/json"}
            });
            if(response.ok){
                let result = await response.json();
                alert("Mail Sent!")
            }
            else {
                alert("Mail not sent!!!");
            }
        
        })
    }
}


// Form Validation
function setError(tag)
{
    if(!tag.value)
    {
        tag.style.borderBottom="1px solid red";
        alert("To send Mail - From Address and To Address Required");
    }
    else setSuccess(tag);
}
function setSuccess(tag)
{
    tag.style.borderBottom="1px solid black";
}
