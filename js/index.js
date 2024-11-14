
let url=window.location.search;
let param=new URLSearchParams(url);
let code=param.get("code");

// console.log(code);

// async function getAuthCode(code) {
//     let res=await fetch(`/token/callback/${code}`);
//     if(res.ok){
//         console.log(code);
//     }
// }

// getAuthCode(code)