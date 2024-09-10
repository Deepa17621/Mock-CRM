


// Fetch to get the meeting list from meeting API

async function getList() {
    try {
        const res=await fetch( `http://localhost:5500/getmeetinglist`, {
            method:"GET",
            headers:{"Content-Type":"application/json"}
        });
        if(!res.ok)
        {
            throw new Error("Error in URL"+res.status);
        }
        else
        {
            let meetingList=await res.json();
            console.log(meetingList);
            
            sendToTable(meetingList);
        }
    } catch (error) {
        
    }
}
getList();

function sendToTable(obj)
{
    console.log(obj);
    
}