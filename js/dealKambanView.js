// 1.Change View From List To Kamban
let selectView=document.querySelector("#selectView");
selectView.addEventListener("change", (e)=>{
    e.preventDefault();
    if(selectView.value=="listView")
    {
        window.location.href=`./dealList.html`;
    }
    else if(selectView.value=="kambanView")
    {
        window.location.href=`./dealKambanView.html`;
    }
});
let standardView=document.querySelector("#stageParent");
let deepaPipeLine=document.querySelector("#deepaPipeline");

//2. Change PipeLine 
let pipeLines=document.querySelector("#pipeLine");
pipeLines.addEventListener("change", (e)=>{
    e.preventDefault();
    if(pipeLines.value=="standardView")
    {
        standardView.style.display="flex";
        deepaPipeLine.style.display="none";

    }
    else if(pipeLines.value=="deepa")
    {
        deepaPipeLine.style.display="flex";
        standardView.style.display="none";
    }
    else if(pipeLines.value=="allPipeLine")
    {

    }
});

// 3.Empty Stage - No Deals Found
let allStageBodies=document.querySelectorAll(".stageBody");

allStageBodies.forEach(body => {
    if(!(body.hasChildNodes()))
    {
        let spann=document.createElement("span");
        spann.innerHTML="No Deals Found";
        body.appendChild(spann);
        body.style.display="flex"
        body.style.justifyContent="center";
        body.style.alignItems="center";
    }
});

// 4. Create Deal From Particular PipeLine
let createDealBtn=document.querySelector("#createDealBtn");
createDealBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`../deal/createDealForm.html?pipeLine=${pipeLines.value}`;
});