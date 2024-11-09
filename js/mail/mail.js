let outerWrapper = document.querySelector(".outerWrapper");

async function getAllFolders() {
    try {
        let res = await fetch(`/mail/getFoldersList`);
        if(res.ok){
            let folders=await res.json();
            await sidebar(folders);
        }
        else{
            throw new Error("Error in Get All Folders Fetch - "+res.status);
        }

    } catch (error) {
        console.log(error);
    }
}
getAllFolders(); // Execution Starts From Here...

async function sidebar(allFolders){
    let sideBarHtml=`<div class="sideBarContainer">`;
    let foldersArray=allFolders.data;
    foldersArray.forEach(f1 => {
        sideBarHtml += `<div id="${f1.folderId}" class="btnForFolders">${f1.folderName}</div>`;
    });
    sideBarHtml += `</div>`;

    outerWrapper.innerHTML=sideBarHtml;
}







