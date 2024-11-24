// If Not A new Mail - Compose Type is Different
let url = window.location.search;
let param = new URLSearchParams(url);


let formm = document.querySelector(".composeMailForm");
let sendMailBtn = document.querySelector(".sendMailBtn");

// form fields
let fromAddress = document.querySelector("#fromAddress");
let toAddress = document.querySelector("#toAddress");
let ccAddresses = document.querySelector("#ccAddresses");
let bccAddresses = document.querySelector("#bccAddress");
let subject = document.querySelector("#subject");
let mailContent = document.querySelector("#message");

let composeType = param.get("composeType");
let folderId = param.get("folderId");
let messageId = param.get("messageId");

// Check whether the url has query param or not  
if(folderId) { 
    //step-1- check whether this compose is for new Mail Or Not
    getAndSetMailDataToFormFields(folderId,messageId);
}
async function getAndSetMailDataToFormFields(folderId,messageId) {

    console.log("folderId:"+folderId);
    console.log("messageId:"+messageId);

    let mailObject = await getMailContent(folderId, messageId);
    let mailMetaData = await getMailMetaData(folderId,messageId);
    console.log(mailObject);
    console.log(mailMetaData);
    
    //set predefined values to form fields - If Not New Mail
    fromAddress.value = mailMetaData.data.toAddress;
    toAddress.value = mailMetaData.data.fromAddress;
    
    if (composeType == "replyMail") {
        fromAddress.setAttribute("readonly", true);
        toAddress.setAttribute("readonly", true);
    }
    else if (composeType == "replyAll") {
        ccAddresses.value = mailMetaData.data.ccAddress;
        bccAddresses.value = mailMetaData.data.bccAddress;
    }
    else if (composeType == "forward") {
        toAddress.value ="";
        mailContent.value = mailObject.data.content;
    }
}
async function getMailContent(folderId, messageId) {
    try {
        let response = await fetch(`/mail/displayMail/${folderId}/${messageId}`, {
            method: "GET"
        });
        if (response.ok) {
            let mailContent = await response.json();
            console.log(mailContent);
            
            return mailContent;
        }
        else return null;
    } catch (error) {
        console.log(error);
    }
}
async function getMailMetaData(folderId, messageId) {
    try {
        let response = await fetch(`/mail/metaDataOfMail/${folderId}/${messageId}`, {
            method: "GET"
        });
        if (response.ok) {
            let mailMetaData = await response.json();
            console.log(mailMetaData);
            return mailMetaData;
        }
        else {
            throw new Error(response)
        }
    } catch (error) {
        console.log(error);
    }
}

sendMailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formm.requestSubmit();
})

formm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!fromAddress.value || !toAddress.value) {
        !fromAddress.value ? setError(fromAddress) : setSuccess(fromAddress);
        !toAddress.value ? setError(toAddress) : setSuccess(toAddress);
        return;
    }

    const requestBody = {
        "fromAddress": fromAddress.value,
        "toAddress": toAddress.value,
        "ccAddress": ccAddresses.value,
        "bccAddress": bccAddresses.value,
        "subject": subject.value,
        "content": mailContent.value,
        // "attachments": [
        //     {
        //         "storeName": "NN2:-167775813820412438",
        //         "attachmentPath": "/1425407266885_ourholidays",
        //         "attachmentName": "ourholidays.jpg"
        //     }
        // ]
    }

    console.log(requestBody);
    let sendMailResponse = await sendMailReq(requestBody);
    if (sendMailResponse) {
        window.location.href = `/html/mail/mail.html`
    }
})

async function sendMailReq(mailObject) {
    try {
        let response = await fetch(`/mail/sendMail`, {
            method: "POST",
            body: JSON.stringify(mailObject),
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            let result = await response.json();
            alert("Mail Sent!");
            return true;
        }
        else {
            alert("Mail not sent!!!");
            throw new Error(response.status + " " + response.statusText);
        }

    } catch (error) {
        console.log(error);

    }
}

// Form Validation
function setError(tag) {
    if (!tag.value) {
        tag.style.borderBottom = "1px solid red";
        alert("To send Mail - From Address and To Address Required");
    }
    else setSuccess(tag);
}
function setSuccess(tag) {
    tag.style.borderBottom = "1px solid black";
}
