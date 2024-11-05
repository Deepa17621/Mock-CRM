class customNavBar extends HTMLElement{
    constructor(){
        super();
    }
    connectedCallback(){
        this.myTemplate();
    }
    myTemplate(){
        let shadow=this.attachShadow({mode:"open"});

        let modules={
            Home:`/index.html`,
            Leads:`/leadForm/leadList.html`,
            Contacts:`/contact/contactList.html`,
            Accounts:`/accounts/accountList.html`,
            Deals:`/deal/dealList.html`,
            Meetings:`/meetings/meetingList.html`,
            Mail:`/mail/mailHome.html`
        }
        let logoWrapper=`<div id="logoDiv"><img src="/assests/iconnn.svg"><span>CRM</span></div>`
        //Outer Container
        let navWrapper=document.createElement("div"); 
        navWrapper.setAttribute("class", "outerForNavBar");
        let leftMenuHtml=`<div class="leftMenu"><li class="logo modules">${logoWrapper}</li>`;
        for (const key in modules) {
            leftMenuHtml+=`<li class="modules" id="${key}"><span>${key}</span></li>`
        }
        leftMenuHtml+=`</div>`; // Left menu wrapper end here.

        navWrapper.innerHTML=leftMenuHtml;
        shadow.appendChild(navWrapper);    
        let styleTag=document.createElement("style");
        styleTag.textContent=this.style();
        shadow.append(styleTag);
        

    }
    style(){
        return `.outerForNavBar{
                    border:1px solid black;
                    height: 7vh;
                    background-color: #313949;
                    color:white;
                }
                .leftMenu{
                    border: 1px solid black;
                    height: inherit;
                    widht: 50vw;
                    display: flex; 
                    // gap: 16px;  
                    font-size: 17px; 
                }
                #logoDiv{
                    height: inherit;
                    width: inherit;
                    display: flex;
                    gap: 5px;
                }
                .modules{
                    // width: 0px;
                    height: inherit;
                    display: flex;
                    cursor: pointer;
                    padding: 10px;
                    border:1px solid white;
                }
                li{
                    list-style:none;
                }
                .active{
                    border-bottom:2px solid white;
                }`
    }
}
customElements.define("custom-navbar", customNavBar);