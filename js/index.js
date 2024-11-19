
// let url=window.location.search;
// let param=new URLSearchParams(url);
// let code=param.get("code");
// let loc = param.get("location");

// // console.log(code);

// async function getAuthCode(code, loc) {
//     if(loc == 'us'){
//         loc = 'com'
//     }
//     else if( loc == 'in'){
//         loc = 'in'
//     }
//     console.log("Deepa");
    
//     let res=await fetch(`/token/callback/${code}/${loc}`);
//     if(res.ok){
//         console.log(code);
//         res.json(code )
//     }
// }

// getAuthCode(code, loc)