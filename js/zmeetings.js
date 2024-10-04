// import dao from "../controller/dao.js";
// let getAllMeetings=new dao('http://localhost:5500/getmeetinglist');

// let res=getAllMeetings.getAll();

// console.log(res);
let url="https://dmock-crm.vercel.app/";
async function getlistOfMeeting() {
    try {
        let res=await fetch(url+'/getmeetinglist', {
            method:"GET"
        });
        let response=await res.json();
        if(res.ok)
        {
            console.log(response.session);
        }
        else throw new Error("Error: "+ res.statusText+" "+res.status)
    } catch (error) {
        
    }

}
getlistOfMeeting()


