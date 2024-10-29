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
let wrapperForKanbanView=document.querySelector("#stageParent");
let pipeLines=document.querySelector("#pipeLine");
// 3. PipeLines From MongoDB
async function getPipeLines(pipeLines) {
    try {
        let res=await fetch(`/getAll/pipeLines`);
        if(res.ok){
            let pipelines=await res.json();
            console.log(pipelines);
            // let option=`<option value="" class="hidden">stages</option>`;
           let option="";
            pipelines.forEach(element => {
                option+=`<option value=${Object.keys(element)[1]}>${Object.keys(element)[1]}</option>`
            });
            pipeLines.innerHTML=option;
            return pipelines;
        }
    } catch (error) {
        
    }
}
// 2. functionCall And Get the pipeLines
let listOfPipeLines=async ()=>{
    return await getPipeLines(pipeLines)
     // select tag has been send as parameter to add options from DB
}
listOfPipeLines();
//4. Change PipeLine 
pipeLines.addEventListener("change", async(e)=>{
    e.preventDefault();
    let selectedPipeLine=e.target.value;
    let data=await listOfPipeLines();
    let stageContainer=""
    data.forEach(element => {
        if(Object.keys(element)[1]==selectedPipeLine){
            console.log(Object.values(element)[1]);
            let stages=Object.values(element)[1];
            for (const key in stages) {
                stageContainer+=` <div id="${key}" class="multipleStagesContainer">
                                    <!-- stage Header -->
                                    <div class="stageHeader">
                                        <div class="firstRow">
                                            <span>${key}</span>
                                            <span class="count" id="${key}+Count">0</span>
                                            <span class="dot">.</span>
                                            <span class="propability">${stages[key]}%</span>
                                        </div>
                                        <div class="secondRow">
                                            <span id="totalAmountOf+${key}" class="rupee"><i class="fa-solid fa-indian-rupee-sign"></i> 0.00</span>
                                        </div>
                                    </div>
                                    <!-- stage Body -->
                                    <div class="stageBody"></div>
                                </div>`
            }
            wrapperForKanbanView.innerHTML=stageContainer;
            return;
        }
    });   
});

// .Empty Stage - No Deals Found
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

// . Create Deal From Particular PipeLine
let createDealBtn=document.querySelector("#createDealBtn");
createDealBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href=`../deal/createDealForm.html?pipeLine=${pipeLines.value}`;
});


