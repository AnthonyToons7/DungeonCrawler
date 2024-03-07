function getHistory() {
    fetch('./public/gameData/assets/historyDirectories.json')
        .then(response => response.json())
        .then(directories => {
            const allHistory = {};

            directories.forEach(directory => {
                fetch(directory)
                    .then(response => response.json())
                    .then(historyData => {
                        allHistory[directory] = historyData;
                        console.log(allHistory);
                    })
                    .catch(error => console.log(error));
            });
        })
        .catch(error => console.log(error));
}

function filter(data) {
    // Assuming data is an array of file names
    data.forEach(filename => {
        if (filename.endsWith('.json')) {
            fetch(`public/gameData/assets/${filename}`)
                .then(response => response.json())
                .then(jsonData => {
                    // Apply any filters that check NSFW content and change the dialog depending on the given data.
                    // For example:
                    console.log(jsonData); // Display fetched JSON data
                })
                .catch(error => console.log(error));
        }
    });
}
