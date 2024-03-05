function getHistory(){
    fetch('./public/gameData/assets/history.json')
    .then(response => response.json())
    .then(data => {filter(data)})
    .catch(error => console.log(error));
}

function filter(data){
    // Apply any filters that check NSFW content and change the dialog depending on the given data.

    const filter = [];
}