// Change View From List To Kamban
let selectView=document.querySelector("#selectView");
selectView.addEventListener("change", (e)=>{
    e.preventDefault();
    if(selectView.value=="listView")
    {
        window.location.href=`./dealList.html`;
    }
    else if(selectView.value=="kambanView")
    {
        window.location.href=`./dealKambanView.html`
    }
});
let standardView=document.querySelector("#stageParent");
let deepaPipeLine=document.querySelector("#deepaPipeline");

// Change PipeLine 
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

// Empty Stage
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