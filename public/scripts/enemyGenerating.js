async function generateEnemy(charactersPresent) {
    const response = await fetch('./public/gameData/enemies.json');
    const enemies = await response.json(); // Parse JSON data

    const randomEnemy = enemies[0];
    // const randomEnemy = enemies[Math.floor(Math.random() * 4)];

    // Find the level of the player
    const player = charactersPresent.find(character => character.name === "Player");
    const playerLevel = player ? player.level : 1;

    // Scale up the enemy's level based on player's level
    // randomEnemy.level = Math.ceil(randomEnemy.level * (1 + playerLevel * 0.1));

    // Multiply the enemy's stats by their own level
    randomEnemy.hp = Math.floor(randomEnemy.hp * (randomEnemy.level * 0.57));
    randomEnemy.atk = Math.floor(randomEnemy.atk * (randomEnemy.level * 0.57));
    randomEnemy.def = Math.floor(randomEnemy.def * (randomEnemy.level * 0.57));

    console.log(JSON.stringify(randomEnemy, null, 2));

    return randomEnemy;
}
