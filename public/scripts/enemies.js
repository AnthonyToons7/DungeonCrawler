function enemyAI(game, player){
  game.enemies.forEach(enemy => {
    if(enemy.hp <= 0){
      game.removeEnemy(enemy);
      game.removeCharacter(enemy);
      if(game.enemies.length == 0){
        document.getElementById("enemies").classList.add("inside-room");
        game.reward();
        document.querySelector(".continueBtn").classList.remove("hide");
      }
      return;
    }
    enemy.attack("enemy", player, game, "ranged");
  });
}
function enemySheets(enemyName, enemyId, allEnemies, enemyType){
    fetch('public/data/spritesheetDirs.json')
      .then(response => response.json())
      .then(data => {
        const characterSources = data.find(characterData => characterData.hasOwnProperty(enemyName));
        
        if (characterSources) {
          const source = characterSources[enemyName];
          sheetAnimator(source, enemyId, enemyName, allEnemies, enemyType);
        } else {
          console.log("Character not found in the data.");
        }
      })
      .catch(error => console.log(error));
  }
  // Animate the sheets
  function sheetAnimator(src, id, name, enemies, type){
    const canvas = document.createElement("canvas");
    canvas.id = name;
    let playerState = 'idle';
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 375;
    const CANVAS_HEIGHT = canvas.height = 375;
    const spriteIMAGE = new Image();
    spriteIMAGE.src = src;
    const spriteWidth = 1280;
    const spriteHeight = 1280;
    let gameFrame = 0;
    const staggerFrames = 8;
    const spriteAnimations = [];
    const animationState = [
        {
            name: "idle",
            frames: 8,
        }
    ];
    animationState.forEach((state, index) => {
        let frames = {
            loc: [],
        }
        for (let j = 0; j < state.frames; j++) {
            let positionX = j * spriteWidth;
            let positionY = index * spriteHeight;
            frames.loc.push({x: positionX, y: positionY});
        }
        spriteAnimations[state.name] = frames;
    });
    function animateSheet(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].
        loc.length;
        let frameX = spriteWidth * position;
        let frameY = spriteAnimations[playerState].loc[position].y;
        ctx.drawImage(spriteIMAGE, frameX, frameY, spriteWidth, 
        spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gameFrame++;
        requestAnimationFrame(animateSheet);
    };
    const container = document.createElement("div");
    enemies.forEach(enemy=>{
      canvas.classList.add(type);
      container.appendChild(canvas);
        if (!enemy.firstChild) {
          document.querySelector(`div#enemies div#${id}`).appendChild(container);
          animateSheet();
        }
    });
}

function enemySelection(type, player, game) {
  document.getElementById("select-enemy-popup").classList.add("show");
  
  function handleClick(event) {
    const enemy = event.currentTarget;
    enemy.classList.add("target");
    player.attack("Player", enemy, game, type);
    if (document.querySelector(".target")) {
      document.querySelector(".target").classList.remove("target");
    }
    if (document.querySelector(".attackPopUp.show")) {
      document.querySelector(".attackPopUp.show").classList.remove("show");
    }
    if (document.querySelector("#select-enemy-popup.show")) {
      document.querySelector("#select-enemy-popup.show").classList.remove("show");
    }
    enemy.removeEventListener("click", handleClick);
    
    setTimeout(() => {
      enemyAI(game, player);
    }, 1000);
  }

  document.querySelectorAll(".enemy").forEach(enemy => {
    enemy.addEventListener("click", handleClick);
  });
}
