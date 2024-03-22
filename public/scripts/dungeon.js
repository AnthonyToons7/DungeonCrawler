let enemyid = 0;
const randomEquips = [
    "Fog blade", 
    "Poison dagger", 
    "Breakthrough armor", 
    "Drainer armor", 
    "Death blow bow", 
    "Clover bow"
];

class Game {
    constructor(floor){
        this.floor = floor,
        this.enemiesDefeated = 0,
        this.loot = 0,
        this.inventory = [],
        this.characters = [],
        this.enemies = [],
        this.currentRoom = "choice",
        this.activeStatusses = [];
        this.turnCount = 0;
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
                // document.querySelector(".background").classList.add("walking");
                // document.querySelector(".background").classList.add("direction-"+index);
                // setTimeout(() => {
                    room.enter();
                // }, 7000);
            });
        });

    }
    reward() {
        let lootGain;
        if (this.currentRoom == "loot") {
            lootGain = Math.floor(200 * (this.floor / Math.random()));
        } else {
            lootGain = Math.floor(85 * (this.floor / Math.random()));
        }
    
        this.loot += lootGain;
        console.log("lootgain: " + lootGain);
        console.log("totalloot: " + this.loot);
    
        // Convert loot value to a string
        const lootString = this.loot.toString();
    
        // Check if the loot value exceeds 10000, 100000, 1000000, etc.
        let numDigits = Math.floor(Math.log10(this.loot)) + 1;
        let numH1Elements = document.querySelectorAll(".loot-value h1").length;
    
        while (numDigits > numH1Elements) {
            // Create a new h1 element
            const newH1 = document.createElement("h1");
            newH1.textContent = "0";
            document.querySelector(".loot-value").appendChild(newH1);
            numH1Elements++;
        }
    
        // Update the text content of each h1 element with the corresponding digit from the loot value
        const h1Elements = document.querySelectorAll(".loot-value h1");
        for (let i = 0; i < numH1Elements; i++) {
            h1Elements[i].textContent = lootString.charAt(i) || '0'; // Use '0' if there are fewer digits than h1 elements
        }
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

        // push the enemy into the bestiary
        if (!unlockedEntries.includes(enemy.name)) {
            unlockedEntries.push(enemy.name);
        }        

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
    removeEnemy(character){
        this.enemies.splice(character, 1);
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
                this.game.reward();
                break;
            case "Armory":
                background.classList.add("armor-room");
                
                const stats = ["hp", "atk", "def", "equips"];
                
                const rand = Math.floor(Math.random() * stats.length);
                if(stats[rand] == "equips"){
                    const randomEquip = Math.floor(Math.random() * randomEquips.length);
                    randomEquips.splice(randomEquip, 1)
                    this.player.equips += randomEquip;
                }
                this.player[stats[rand]] += 1;
                this.player.update();
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
                break;
        }
        this.game.currentRoom = this.type;
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
        this.equips = equips
        this.currentlyEquipped = []
    }

    attack(attacker, target, game, type){
        let drainerArmor;
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
        
                const randomEnemyEl = document.getElementById("enemy-" + id);
                if (randomEnemyEl) {
                    randomEnemyEl.classList.add("target");
                }
            }
        
            // Find the enemy with the matching id and reduce its hp
            const enemyIndex = game.enemies.findIndex(enemy => enemy.id === id);
            if (enemyIndex !== -1) {
                let bonusAtk = 0;

                // Apply any bonusses or flaws from equips.
                if(type === "rangedAtk" && this.equips){
                    switch(this.currentlyEquipped){
                        case "Death blow bow":
                            const missChance = Math.random() * 100 >= 2; 
                            if (missChance) {
                                bonusAtk += 10;
                            } else {
                                return;
                            }
                            break;
                        case "Clover bow":
                            const critChance = Math.random() * 100 >= 5; 
                            if (!critChance) {
                                bonusAtk += Infinity;
                            } else {
                                bonusAtk -= 2;
                            }
                            break;
                    }
                } else if(type === "meleeAtk" && this.equips){
                    switch(this.currentlyEquipped){
                        case "Fog blade":
                            bonusAtk += 2;
                            const restrict = new StatusEffect("restrict", game.enemies[enemyIndex], this.game, 1);
                            this.game.activeStatusses += restrict;
                            break;
                        case "Poison dagger":
                            const poisonChance = Math.random() * 100 >= 10; 
                            if (!poisonChance) {
                                const poison = new StatusEffect("poison", game.enemies[enemyIndex], this.game, 5);
                                this.game.activeStatusses += poison;
                            }
                            bonusAtk += 1;
                            break;
                        case "Drainer armor":
                            drainerArmor = true;
                            break;
                    }
                }

                let damage = Math.max(1, (this.atk + bonusAtk) - game.enemies[enemyIndex].def);
                game.enemies[enemyIndex].type;

                // If you use a bow against a ranged foe, deal extra damage
                const finalDamage = 
                type == "rangedAtk" && game.enemies[enemyIndex].type == "ranged"
                
                ? Math.ceil(damage * 1.5) : damage;

                game.enemies[enemyIndex].hp = game.enemies[enemyIndex].hp - finalDamage;

                if (drainerArmor){
                    this.hp = Math.min(this.hp + finalDamage / 5, this.maxHp);
                }

                game.enemies[enemyIndex].update();
            }
        } else {
            // Initiate counter function
            const damage = Math.max(1, this.atk - target.def);
            struggle(damage, this, target, (result) => {
                const damageIncrease = result[0];
                const counterattackDamage = result[1];
            
                const finalDamage = Math.floor(damage + damageIncrease);
                target.hp -= Math.max(finalDamage, 1);
                target.update();
            
                if (counterattackDamage != 0) {
                    console.log("Counter for " + counterattackDamage + "!");
                    this.hp -= counterattackDamage;
                    const id = this.id;
                    const enemyIndex = game.enemies.findIndex(enemy => enemy.id === id);
                    game.enemies[enemyIndex].update();
                }
            });
        }
    }
}
class Player extends Character {
    constructor(name, level, hp, maxHp, atk, def, equips, exp, currentlyEquipped, extra){
        super(name,level,hp,maxHp,atk,def,equips,currentlyEquipped),
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
    equip(id){
        this.currentlyEquipped += id
    }
    unequip(id){
        this.currentlyEquipped -= id;
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
class StatusEffect {
    constructor(type, target, game, duration){
        this.type = type,
        this.target = target,
        this.game = game,
        this.duration = duration
    }
    tick(){

    }
}

function generateRooms() {
    const roomTypes = ["Empty", "Loot", "Armory", "Enemy"];
    const roomType = "Enemy";
    // const roomType2 = "Loot";
    // const roomType = roomTypes[Math.floor(Math.random() * 4)];
    const roomType2 = roomTypes[Math.floor(Math.random() * 4)];

    return [roomType,roomType2];
}

document.addEventListener('DOMContentLoaded',()=>{
    updateVolumeBars();
    const game = new Game(1);
    const player = new Player("Player", 1, 10, 10, 4, 3,"");
    const inventory = new Inventory();
    player.update();
    
    game.createRooms(generateRooms(), player);

    document.querySelector(".continueBtn").addEventListener("click",()=>{
        document.querySelector(".continueBtn").classList.add("hide");
        const background = document.querySelector(".background");
        playSound("menu-sound.mp3");
        document.querySelectorAll(".room").forEach(room=>room.remove());
        document.querySelectorAll(".combat .btn").forEach(btn=>btn.classList.add("disabled"));
        // document.querySelector(".background").classList.add("walking-further");
        // setTimeout(()=>{
            const classes = ["enemy-room", "loot-room", "armor-room", "empty-room"];            
            classes.forEach(className=> {
                if (background.classList.contains(className)) {
                    background.classList.remove(className);
                }
            });
            
        // },2000)
        // setTimeout(() => {
            game.floor += 1;
            document.getElementById("floorIndex").textContent = game.floor;
            game.createRooms(generateRooms(), player);
            // background.classList.remove("walking-further");
        // }, 3000);
        // setTimeout(() => {
            background.classList.remove("inside-room");
        // }, 7000);
    });

    document.querySelector(".btn.attack").addEventListener("click",()=>{
        const attackBtn = document.querySelector(".btn.attack");
        const attackPopup = document.querySelector(".attackPopUp");
        const attackBtnRect = attackBtn.getBoundingClientRect();
        attackPopup.style.top = (attackBtnRect.top - 50) + "px";
        attackPopup.style.left = attackBtnRect.right + "px";
        attackPopup.classList.add("show");
    });
    
    const melee = document.querySelector(".attackPopUp .option-melee");
    const ranged = document.querySelector(".attackPopUp .option-ranged");
    melee.addEventListener("click",()=>{
        enemySelection(melee.id,player,game);
    });
    ranged.addEventListener("click",()=>{
        enemySelection(ranged.id,player,game);
    });

        
    document.querySelector(".btn.inventory").addEventListener("click", ()=>{
        inventory.createInventory();
        document.getElementById("inventory").classList.toggle("show");
    });
    document.querySelector("#inventory .cross").addEventListener("click", ()=>{document.getElementById("inventory").classList.toggle("show");});

    document.addEventListener("keydown", (event) => {
        switch(event.key){
            case "ArrowRight":
                if (game.currentRoom === "choice" && !document.body.classList.contains("tutorial-open")) {
                    document.querySelector("#rooms .right").click();
                } else if (document.body.classList.contains("tutorial-open")) {
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
                break;
            case "ArrowLeft":
                if (game.currentRoom === "choice") {
                    document.querySelector("#rooms .left").click();
                }
                break;
            case "b":
                document.querySelector("#bestiary.popUp.show") ? document.querySelector("#bestiary.popUp.show").classList.remove("show") : createEntries();
                break;
            case "i":
                inventory.createInventory();
                document.getElementById("inventory").classList.toggle("show");
                break;
        }
      });

    // Creating items
    const sword = new Item('Sword', 'sword.png', 'weapons');
    const shield = new Item('Shield', 'shield.png', 'armor');
    const potion = new Item('Potion', 'potion.png', 'general');

    // Adding items to inventoryiii
    inventory.weaponryItems.push(sword);
    inventory.armorItems.push(shield);
    inventory.generalItems.push(potion);

    setTimeout(()=>{
        getHistory();
    }, 4000)
});
