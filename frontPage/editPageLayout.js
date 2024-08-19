let inputs=document.getElementsByClassName("inputs");
let myForm=document.querySelector("form");
for (const inp of inputs) 
{
    inp.addEventListener("dragstart", function(e){
        let item= e.target;
        
        myForm.addEventListener("dragover",function(e){
            e.preventDefault();
        });

        myForm.addEventListener("drop",(e)=>{
            if(item)
            {
                myForm.appendChild(item);
                myForm.appendChild(document.createElement("br"));
                item=null;
            }
        });
    });

}