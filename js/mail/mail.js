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
    let sideBarHtml=`<div class="sideBarContainer">`;
    let foldersArray=allFolders.data;
    foldersArray.forEach(f1 => {
        sideBarHtml += `<div id="${f1.folderId}" class="btnForFolders" onclick="getListOfMail(this.id)">${f1.folderName}</div>`;
    });
    sideBarHtml += `</div>`;
    outerWrapper.innerHTML=sideBarHtml;
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
        li.addEventListener("click", (e)=>{
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









