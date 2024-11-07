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
        let res=await fetch(`/mongodb/getAll/pipeLines`);
        if(res.ok){
            let pipelines=await res.json();
            return pipelines;
        }
    } catch (error) {console.log(error);
    }
}
// 2. set Options to different pipeLines Choose
async function setPipeLines(pipeLines) {
    let pipelines=await getPipeLines();
    let option=`<option value="" class="hidden">stages</option>`;
    pipelines.forEach(element => {
        option+=`<option value=${Object.keys(element)[1]}>${Object.keys(element)[1]}</option>`
    });
    pipeLines.innerHTML=option;
}
setPipeLines(pipeLines);

// 5. Get All Deals to display 
async function getAllDeals(module) {
    try {
        let res=await fetch(`/mongodb/getAll/${module}`);
        if(res.ok){
            let allDeals=await res.json();
            return allDeals;
        }
        else {
            throw new Error("Error in fetching Deals: "+ res.status+ " "+ res.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//4. Change PipeLine 
pipeLines.addEventListener("change", async(e)=>{
    e.preventDefault();
    let selectedPipeLine=e.target.value;
    let data=await getPipeLines();
    let allDeals=await getAllDeals("deals");
    let stageContainer=""
    data.forEach(async(element) => {
        if(Object.keys(element)[1]==selectedPipeLine){
            let dealsArr=[];
            allDeals.forEach(async(element) => {    
                        if(element.pipeLine==selectedPipeLine){
                            let obj=await element;
                            console.log(obj);
                            dealsArr.push(obj);
                        }               
            });
            console.log(Object.values(element)[1]);
            let stages=Object.values(element)[1];
            for (const key in stages) {
                stageContainer+=`<div id="${key}" class="multipleStagesContainer">
                                    <!-- stage Header -->
                                    <div class="stageHeader ${stages[key]==0?"lost":stages[key]==100?"won":""}">
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
                                    <div class="stageBody">${(await setDataToStageBodies(dealsArr, key))}</div>
                                </div>`
            }
            wrapperForKanbanView.innerHTML=stageContainer;
            return;
        }
    });   
});
async function setDataToStageBodies(dealsArray, stageName) {
    let arr=await dealsArray;
    let stage=await stageName;
    let structure=``;
    arr.forEach(async(obj )=> {
        if(obj.stage==stage){
            console.log(obj);
            structure+=`<div id=${obj._id} class="contentWrapper" draggble="true">
                            <span class="spanForDealName" id=${obj._id} onclick="viewDeal(this.id, this)">${obj.dealName}</span>
                            <span class="spanForDealOwner">${obj.dealOwner}</span>
                            <span class="spanForAccName">${obj.accountName}</span>
                            <span class="spanForDealAmount">${obj.amount}</span>
                            <span class="spanForClosingDate">${obj.closingDate}</span>
                        </div>`
        }
    });
    return structure!=""?structure:"No Deals";
}
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

// Click Event To Display the Deal Details
function viewDeal(id, tag){
    tag.style.color="blue"
    window.location.href=`/deal/dealView.html?id=${id}`;
}


