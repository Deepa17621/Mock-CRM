


// Fetch to get the meeting list from meeting API
async function getList() {
    try {
        const res=await fetch('/getmeetinglist');
        let meetingList=await res.json();
        if(!res.ok)
        {
            throw new Error("Error in URL"+res.status);
        }
            console.log(meetingList);
            console.log(meetingList["session"]);
            sendToTable(meetingList["session"]);
    } catch (error) {
        console.log(error);  
    }
}

    getList();  // Execution Starts Here...

    // Table to List All the meetings

    let table=document.querySelector("#meetingListTable");
function sendToTable(obj)
{
    //Table Head
    let thead=document.createElement("tr");
    table.appendChild(thead);
    let theadArr=["Title", "From", "To", "Host"];
    theadArr.forEach(e=>{
        let th=document.createElement("th");
        th.innerHTML=e;
        thead.appendChild(th)
    });
    for (let i = 0; i < obj.length; i++) {
        let tr=document.createElement("tr");
        table.appendChild(tr);
        let titleTD=document.createElement("td");
        tr.appendChild(titleTD);
        titleTD.innerHTML=obj[i]["topic"];
        titleTD.setAttribute("id", obj[i]["meetingKey"])
        titleTD.setAttribute("onclick", "rowClickedEvent(this.id)");
        titleTD.style.cursor="pointer";
        let fromTD=document.createElement("td");
        tr.appendChild(fromTD);
        fromTD.innerHTML=obj[i]["startTime"];
        let toTD=document.createElement("td");
        tr.appendChild(toTD);
        toTD.innerHTML=obj[i]["endTime"];
        let hostTD=document.createElement("td");
        tr.appendChild(hostTD);
        hostTD.innerHTML=obj[i]["presenterFullName"];
        
    }
}
// Row Clicked Event===> To Display Meeting Details

function rowClickedEvent(meetingKey)
{
    window.location.href=`/meetings/viewMeeting.html?meetingKey=${meetingKey}`;
}

// menu bar for delete and Edit Meeting Details


