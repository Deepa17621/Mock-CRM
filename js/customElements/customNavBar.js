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
        let logoWrapper=`<div id="logoDiv" data-url="/index.html" class="modules"><img src="/assests/iconnn.svg"><span>CRM</span></div>`
        //Outer Container
        let navWrapper=document.createElement("div"); 
        navWrapper.setAttribute("class", "outerForNavBar");
        let leftMenuHtml=`<div class="leftMenu"><li class="logo modules">${logoWrapper}</li>`;
        for (const key in modules) {
            leftMenuHtml+=`<li class="modules" id="${key}" data-url="${modules[key]}" ><span>${key}</span></li>`
        }
        leftMenuHtml+=`</div>`; // Left menu wrapper end here.

        navWrapper.innerHTML=leftMenuHtml;
        shadow.appendChild(navWrapper);    
        let styleTag=document.createElement("style");
        styleTag.textContent=this.style();
        shadow.append(styleTag);

        navWrapper.addEventListener("click", this.handleMenuClick.bind(this));
        
    }

    handleMenuClick(event) {

        const clickedElement = event.target.closest('.modules');
        if (clickedElement) {

          this.setActive(clickedElement);

          const url = clickedElement.getAttribute('data-url');
          if (url) {
            window.location.href = url;
          }
        }
    }

    // Set the clicked element as active
    setActive(clickedElement) {
        // Remove 'active' class from all modules
        // const allModules = this.shadowRoot.querySelectorAll('.modules');
        // allModules.forEach((module) => module.classList.remove('active'));

        // Add 'active' class to the clicked element
        clickedElement.classList.add('active');
    }
    style(){
        return `@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
                body{
                    padding: 0;
                    margin: 0;
                    font-family: "open Sans",sans-serif
                }
                .outerForNavBar{
                    border: 1px solid black;
                    height: 7vh;
                    background-color: #313949;
                    color:white;
                }
                .leftMenu{
                    height: inherit;
                    widht: 50vw;
                    display: flex; 
                }
                #logoDiv{
                    height: inherit;
                    width: inherit;
                    display: flex;
                    gap: 5px;
                }
                .modules{
                    height: inherit;
                    display: flex;
                    cursor: pointer;
                }
                .modules>span, .modules>div{
                    padding: 10px;
                }
                .modules:hover{
                    &.modules>span, .logo{
                        border-bottom:2px solid green; 
                    }   
                }
                li{
                    list-style:none;
                }
                .active{
                    border-bottom:2px solid green;
                }`
    }
}
customElements.define("custom-navbar", customNavBar);