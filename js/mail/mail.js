let outerWrapper = document.querySelector(".outerWrapper");

async function getAllFolders() {
    try {
        let res = await fetch(`/mail/getFoldersList`);
        let result = await res.json();
       if (res.ok && !result.url) {
            let folders = result;
            console.log(folders);
            await sidebar(folders); // step-2
        }
        else {
            throw new Error("Error in Get All Folders Fetch - " + res.status);
        }
    } catch (error) {
        console.log(error);
    }
}
async function getAuthCode() {
    let res = await fetch(`/mail/getFoldersList`);
    let result = await res.json();
    if (res.ok && result.url) {
        window.location.href = result.url;
    }
    else if (res.ok && !result.url) {
        console.log(result);
        await sidebar(result); // step-2
    }

}
getAuthCode();
async function sidebar(allFolders) {
    let sideBar = document.createElement("div");
    sideBar.setAttribute("class", "sideBarContainer")
    let sideBarHtml = `<button class="composeMailBtn" onclick="composeMail()">New Mail - Compose <i class="fa-solid fa-pen"></i> </button>`
    let foldersArray = allFolders.data;
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
            method: "GET"
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

    if (document.querySelector(".displayContainer")) {
        (document.querySelector(".displayContainer")).remove();
    }
    if (existingElement) {
        existingElement.remove();
    }
    if (document.querySelector(".newMailContainer")) {
        (document.querySelector(".newMailContainer")).remove();
    }
    console.log(mailList);

    let wrapperForMailList = document.createElement("div");
    wrapperForMailList.setAttribute("class", "aside");
    outerWrapper.appendChild(wrapperForMailList);

    let classA = document.querySelector(".styleForEmpty");

    if (mailList.length == 0) {
        let emptyPageContent = `<div class= "emptyContainer"> <b> No messages found in this folder</b></div>`;
        wrapperForMailList.innerHTML = emptyPageContent;
        wrapperForMailList.classList.add("styleForEmpty");
    }
    else if (classA) {
        classA.classList.remove(".styleForEmpty");
    }
    let topForMailList = `<div> <div> <input type="checkbox" name="" class="overAllCheckBox"> <span><span></div></div><hr>`
    mailList.forEach(mail => {

        let li = document.createElement("div");
        li.setAttribute("class", "list");
        li.addEventListener("click", async (e) => {  //step - 6
            e.preventDefault();
            if (document.querySelector(".displayContainer")) {
                (document.querySelector(".displayContainer")).remove();
            }
            await displayMail(mail);
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
async function displayMail(maill, mailMetaData) {
    // console.log("folderId"+folderId);
    // console.log("messageId"+messageId);
    let mailContent = await getMailContent(maill.folderId, maill.messageId);
    console.log(maill.folderId + "," + maill.messageId);

    // console.log(mailContent.data.content);
    console.log(mailContent);
    // console.log(mailMetaData);

    if (mailContent) {
        let displayContainer = document.createElement("section");
        let headerForDisplayMailContent = `<div id="headerForDisplayMail">
                                                <div class="topRow">
                                                    <div class="headerIcons summary"><b>${maill.subject}</b></div>
                                                    <div class="headerIcons closeMail" onclick="closeMail()" title="closeMail"><i class="fa-solid fa-xmark" style="color: black;"></i></div>
                                                </div>
                                                <div class="secondRow">
                                                    <div class="symbols avator"></div>
                                                    <div class="symbols senderMail"><span>${maill.fromAddress}</span></div>
                                                    <div class="symbols reply ${maill.folderId}" id="${maill.messageId}" onclick="replyToMail(this.id, this.classList)" title="reply"><i class="fa-solid fa-reply fa-2sm" style="color: #74C0FC;"></i></div>
                                                    <div class="symbols replayAll ${maill.folderId}" id="${maill.messageId}" onclick="replyAll(this.id, this.classList)" title="replyAll"><i class="fa-solid fa-reply-all fa-2sm" style="color: #74C0FC;"></i></div>
                                                    <div class="symbols forward ${maill.folderId}" id="${maill.messageId}" onclick="forwardMail(this.id, this.classList)" title="forward"><i class="fa-solid fa-arrow-right fa-2sm" style="color: #74C0FC;"></i></div>
                                                </div>
                                           <div>`
        let bodyContainerForMail = `<div class="contentContainer">${mailContent.data.content}</div>`
        headerForDisplayMailContent += bodyContainerForMail;
        displayContainer.setAttribute("class", "displayContainer");
        displayContainer.innerHTML = headerForDisplayMailContent; //this headerForDispalyMailContent has concatinated with overAll Display Content of Mail
        outerWrapper.appendChild(displayContainer);

    }
}

async function replyToMail(mId, classList) {

    console.log("FolderId: " + classList[2]);
    console.log("MessageId: " + mId);
    window.location.href = `/html/mail/composeMail.html?composeType=replyMail&messageId=${mId}&folderId=${classList[2]}`;
}

async function replyAll(mId, classList) {
    window.location.href = `/html/mail/composeMail.html?composeType=replyAll&messageId=${mId}&folderId=${classList[2]}`;
}

async function forwardMail(mId, classList) {
    window.location.href = `/html/mail/composeMail.html?composeType=forward&messageId=${mId}&folderId=${classList[2]}`;
}

// step - 8
async function getMailContent(folderId, messageId) {
    try {
        let response = await fetch(`/mail/displayMail/${folderId}/${messageId}`, {
            method: "GET"
        });
        if (response.ok) {
            let mailContent = await response.json();
            return mailContent;
        }
        else return null;
    } catch (error) {
        console.log(error);
    }
}

// step - 9 
function composeMail() {

    window.location.href = `/html/mail/composeMail.html`;
}