let inputs=document.getElementsByClassName("inputs");
let myForm=document.querySelector("form");
myForm.addEventListener("dragover",function(e){
            e.preventDefault();
        });
for (const inp of inputs) 
{
    inp.addEventListener("dragstart", function(e){
        let item= e.target;
        item.nextElementSibling.remove();
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