const unlockedEntries=[];
document.querySelector(".btn.bestiary").addEventListener("click", ()=>{createEntries()});
document.querySelector("#bestiary .cross").addEventListener("click", ()=>{document.getElementById("bestiary").classList.remove("show")});

async function getEntries(){
    return fetch('public/gameData/bestiary.json')
    .then(response => response.json())

}

async function createEntries(){
    const maxEntries = 5;
    document.querySelectorAll(".entries div").forEach(el=>{el.remove()});
    if(unlockedEntries.length != 0){
        for (let i=0;i<maxEntries;i++) {
            const enemy = await getEntries();
            const entryContainer = document.createElement("div");
            entryContainer.classList.add("entry");
            if(i==0)entryContainer.classList.add("active");
            if(unlockedEntries[i]){
                entryContainer.textContent=unlockedEntries[i];
            } else {
                entryContainer.textContent="???";
            }
            entryContainer.addEventListener("click",()=>{
                if(document.querySelector(".active")) document.querySelector(".active").classList.remove("active");
                document.querySelector(".entry-info").innerHTML='';
                entryContainer.classList.add("active");
                const imageContainer = document.createElement("div");

                const information = document.createElement("p");

                const image = document.createElement("img");
                imageContainer.classList.add("entry-image");
                image.src=`public/img/bestiary/${document.querySelector(".entry.active").textContent}.png`;
                imageContainer.appendChild(image);
                
                information.textContent= 
                enemy[document.querySelector(".entry.active").textContent] ? 
                enemy[document.querySelector(".entry.active").textContent] :
                 "???";

                document.querySelector(".entry-info").append(imageContainer,information);
                
            });
            document.querySelector(".entries").appendChild(entryContainer);
        }
    } else {
        for (let i=0;i<maxEntries;i++) {
            const entryContainer = document.createElement("div");
            entryContainer.classList.add("entry");
            if(i==0)entryContainer.classList.add("active");
            entryContainer.textContent="???";
            document.querySelector(".entries").appendChild(entryContainer);
            document.querySelector(".entry-info").textContent="No information...";
            entryContainer.addEventListener("click",(e)=>{
                if(document.querySelector(".active")) document.querySelector(".active").classList.remove("active");
                e.currentTarget.classList.add("active");
            });
        }
    }

    document.getElementById("bestiary").classList.add("show");
    getEntries();
}