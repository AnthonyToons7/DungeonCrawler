let enemyid = 0;
class Game {
    constructor(floor){
        this.floor = floor,
        this.enemiesDefeated = 0,
        this.inventory = [],
        this.characters = [],
        this.enemies = []
        this.currentRoom = "choice"
    }
    thunderStrike(){
        this.characters.forEach(character=>{
            character.hp = character.hp - 10;
            if(character.hp <= 0){
                this.removeCharacter(character);
            }
        })
    }
    createRooms(roomTypes, player){
        const firstRoom = new Room(roomTypes[0], this, player);
        const secondRoom = new Room(roomTypes[1], this, player);

        const rooms = [firstRoom, secondRoom];
        rooms.forEach((room, index)=>{
            const container = document.createElement("img");
            index == 0 ? container.src = "public/img/icons/btn-left.svg" : container.src = "public/img/icons/btn-right.svg";
            container.classList.add("room");
            index == 0 ? container.classList.add("left") : container.classList.add("right");
            document.getElementById("rooms").appendChild(container);
            
            container.addEventListener("click",()=>{
                playSound("menu-sound.mp3");
                this.currentRoom = room;
                document.querySelectorAll(".room").forEach(room=>room.remove());
                document.querySelector(".background").classList.add("walking");
                document.querySelector(".background").classList.add("direction-"+index);
                setTimeout(() => {
                    room.enter();
                }, 7000);
            });
        });

    }
    async spawnEnemy(){
        enemyid++;
        const stats = await generateEnemy(this.enemies);
        const { name, level, hp, atk, def, equips, trait, type } = stats;
        const enemy = new Enemy("enemy-"+enemyid, name, level, hp, hp, atk, def, equips, trait, type);

        const enemyBlock = document.createElement("div");
        enemyBlock.id="enemy-"+enemyid;
        enemyBlock.classList.add("enemy");
        document.getElementById("enemies").appendChild(enemyBlock);

        this.addCharacter(enemy);
        this.addEnemy(enemy);

        // stat bars
        const enemyStatContainer= document.createElement("div");
        const healthBar = document.createElement("div");
        const healthValue = document.createElement("div");
        healthValue.width = "width", (enemy.hp / enemy.maxHp) * 100 + "%";
        healthBar.appendChild(healthValue);
        healthBar.classList.add("enemy-health");

        const enemyType = document.createElement("div");
        const icon = document.createElement("img");
        icon.src = "public/img/icons/enemyTypes/"+enemy.type+".png";
        enemyType.appendChild(icon);
        enemyType.classList.add("enemyType-icon")

        enemyStatContainer.classList.add("enemyStatContainer");
        enemyStatContainer.append(healthBar, enemyType);

        enemySheets(enemy.name, enemy.id, this.enemies, enemy.type);

        document.getElementById(enemy.id).appendChild(enemyStatContainer);

        document.querySelectorAll(".combat .btn.disabled").forEach(btn=>{
            btn.classList.remove("disabled");
        });
    }
    addEnemy(character){
        this.enemies.push(character);
    }
    addCharacter(character){
        this.characters.push(character);
    }
    removeCharacter(character){
        this.characters.splice(character, 1);
    }
}

class Room {
    constructor(type, game, player){
        this.type = type
        this.game = game
        this.player = player
    }
    
    enter(){
        const background = document.querySelector(".background");

        switch(this.type){
            case "Empty":
                background.classList.add("empty-room");
                console.log("There's nothing...");
                break;
            case "Loot":
                background.classList.add("loot-room");
                console.log("Loot! +100 gold");
                break;
            case "Armory":
                background.classList.add("armor-room");
                console.log("You found... a sword! +5 ATK");
                break;
            case "Trap":
                background.classList.add("trap-room");
                console.log("it's a trap! -10HP");
                this.game.thunderStrike();
                break;
            case "Enemy":
                background.classList.add("enemy-room");
                console.log("Enemy incoming");
                this.game.spawnEnemy();

                const melee = document.querySelector(".attackPopUp .option-melee");
                const ranged = document.querySelector(".attackPopUp .option-ranged");
                melee.addEventListener("click",()=>{
                    enemySelection(melee.id,this.player,this.game);
                });
                ranged.addEventListener("click",()=>{
                    enemySelection(ranged.id,this.player,this.game);
                });
                
                break;
        }

        


        background.classList.remove("walking");
        if (background.classList.contains("direction-0")) {
            background.classList.remove("direction-0");
        } else if (background.classList.contains("direction-1")) {
            background.classList.remove("direction-1");
        }

        background.classList.add("inside-room");
        document.getElementById("enemies").classList.add("inside-room");

            
        this.type != "Enemy" ? document.querySelector(".continueBtn").classList.remove("hide") : document.querySelector(".continueBtn").classList.add("hide");
    }
}

class Character {
    constructor(name, level, hp, maxHp, atk, def, equips) {
        this.name = name,
        this.level = level,
        this.hp = hp,
        this.maxHp = maxHp,
        this.atk = atk,
        this.def = def,
        this.critRate = (0.055 - 0.071) / (50 - 1) * (level - 1) + 0.071,
        this.equip = equips
    }

    attack(attacker, target, game, type){
        playSound("hit-sound.mp3");
        if (attacker == "Player") {
            // The element that has the target class
            const targetEl = target;
            let id;
            // Trying to retrieve the id of the element
            if (targetEl) {
                id = targetEl.id;
            } else {
                // If no target ID, choose a random enemy to target
                const randomEnemyIndex = Math.floor(Math.random() * game.enemies.length);
                id = game.enemies[randomEnemyIndex].id;
        
                // Assign the "target" class to the chosen enemy element
                const randomEnemyEl = document.getElementById("enemy-" + id);
                if (randomEnemyEl) {
                    randomEnemyEl.classList.add("target");
                }
            }
        
            // Find the enemy with the matching id and reduce its hit points
            const enemyIndex = game.enemies.findIndex(enemy => enemy.id === id);
            if (enemyIndex !== -1) {
                // Calculate damage inflicted
                const damage = Math.max(1, this.atk - game.enemies[enemyIndex].def);

                // If you use a bow against a ranged foe, deal extra damage
                const finalDamage = 
                type == "rangedAtk" && game.enemies[enemyIndex].type == "ranged"
                
                ? Math.ceil(damage * 1.5) : damage;

                game.enemies[enemyIndex].hp -= finalDamage

                game.enemies[enemyIndex].update();
            }
        } else {
            // Attacker is not the player, subtract defender's defense from attacker's attack to calculate damage
            const damage = Math.max(1, this.atk - target.def);
            target.hp -= damage;
            target.update();
        }
    }
}
class Player extends Character {
    constructor(name, level, hp, maxHp, atk, def, equips, extra){
        super(name,level,hp,maxHp,atk,def,equips),
        this.extra = extra
    }
    update(){
        if (this.hp !== null && parseInt(this.hp) <= 0) {
            document.getElementById("gameOver").classList.add("show");
        }
        document.querySelector(".health").textContent=this.hp;
        document.querySelector(".attack").textContent=this.atk;
        document.querySelector(".defense").textContent=this.def;
    }
}
class Enemy extends Character {
    constructor(id, name, level, hp, maxHp, atk, def, equips, trait, type){
        super(name,level,hp,maxHp,atk,def,equips),
        this.id = id,
        this.trait = trait,
        this.type = type
    }
    update(){
        const enemy = document.querySelector(`#${this.id}`);
        const hpBar = enemy.querySelector(".enemy-health");
        this.hp <= 0 ? hpBar.parentElement.parentElement.remove() : hpBar.querySelector("div").style.width = (this.hp / this.maxHp) * 100 + "%";
    }
}


function generateRooms() {
    const roomTypes = ["Empty", "Loot", "Armory", "Enemy"];
    const roomType = "Enemy";
    // const roomType = roomTypes[Math.floor(Math.random() * 4)];
    const roomType2 = roomTypes[Math.floor(Math.random() * 4)];

    return [roomType,roomType2];
}

document.addEventListener('DOMContentLoaded',()=>{
    updateVolumeBars();
    const game = new Game(0);
    const player = new Player("Player", 1, 10, 10, 4, 3,"");
    player.update();
    
    game.createRooms(generateRooms(), player);

    document.querySelector(".continueBtn").addEventListener("click",()=>{
        game.createRooms(generateRooms(), player);
    });

    document.querySelector(".btn.attack").addEventListener("click",()=>{
        const attackBtn = document.querySelector(".btn.attack");
        const attackPopup = document.querySelector(".attackPopUp");
        const attackBtnRect = attackBtn.getBoundingClientRect();
        attackPopup.style.top = (attackBtnRect.top - 50) + "px";
        attackPopup.style.left = attackBtnRect.right + "px";
        attackPopup.classList.add("show");
    });

    getHistory();

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          if (game.currentRoom === "choice" && !document.body.classList.contains("tutorial-open")) {
            document.querySelector("#rooms .right").click();
          } else {
            const handOverlay = document.querySelector(".hand-overlay img");
            if (handOverlay) {
                handOverlay.style.transform = `translate(0px, 100vh)`;
                setTimeout(() => {
                    playSound("page-turn.mp3");
                    handOverlay.style.transform = `translate(0px, 0vh)`;    
                    handOverlay.src="public/img/tutorial-pages/tutorial-page-2.png";
                    document.querySelector(".nextPage").style.display="none";
                }, 2000);
            }
          }
        } else if (event.key === "ArrowLeft") {
          if (game.currentRoom === "choice") {
            document.querySelector("#rooms .left").click();
          }
        }
      });
});