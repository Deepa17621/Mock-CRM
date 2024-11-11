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
        console.log(folderId);
        console.log("DIvya - Before get mail list");
        
        let response = await fetch(`/mail/getListOfEmails/${folderId}`, {
            method : "GET"
        });
        if (response.ok) {
            let mailList = await response.json();
            // console.log(mailList.data);            
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

    console.log(mailList);
    console.log("Display - Prakash Rajendiran");
    
    let wrapperForMailList = document.createElement("div");
    wrapperForMailList.setAttribute("class", "aside");
    outerWrapper.appendChild( wrapperForMailList );

    mailList.forEach(mail => {

        console.log("For Each ===> Deepa Rajendiran");
        
        console.log(mail);

        let mailDiv = document.createElement("div");
        wrapperForMailList.appendChild(mailDiv);
        mailDiv.id=mail.messageId;
        mailDiv.setAttribute("class", "listt")
        mailDiv.style.cursor="pointer";
        let html = `<span>${mail.sender}</span>`;
        html += `<span>${mail.summary}</span>`;
        mailDiv.innerHTML=html;


    });
 }









