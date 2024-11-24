class customHeaderForMail extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallBack(){
        this.myHeaderTemplate();
    }
    myHeaderTemplate(){

        let shadow = this.attachShadow({ mode: "open" });

        let wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");

        let structure = `<div id="topRow">
                            <div class="headerIcons summary"></div>
                            <div class="headerIcons closeMail" onclick="closeMail()" id=``><i class="fa-solid fa-xmark fa-xs" style="opacity:0.2"></i></div>
                         </div>
                         <div class= "recondRow">
                            <div class="recondRow">
                                <div class="symbols avator"></div>
                                <div class="symbols senderMail"></div>
                                <div class="symbols reply" onclick="replayToMail()"></div>
                                <div class="symbols replayAll" onclick="replyAll()"></div>
                                <div class="symbols forward" onclick="forwardMail()"></div>
                            </div>
                         </div>`
        
        wrapper.innerHTML = structure;
        shadow.appendChild(wrapper);
    }
    closeMail(){
        
    }
}