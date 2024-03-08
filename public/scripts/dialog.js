const obj = {};
let i = 0;
const hasLookedAt = [];
const dialog = [];

function getHistory() {
    fetch('./public/gameData/assets/historyDirectories.json')
        .then(response => response.json())
        .then(directories => {
            // Array to store promises for all fetch requests
            const promises = directories.map((directory, index) => {
                const profileIndex = index + 1;
                return fetch(directory.dir)
                    .then(response => response.json())
                    .then(historyData => {
                        obj[`profile${profileIndex}`] = historyData;
                    })
                    .catch(error => console.log(error));
            });

            // Wait for all fetch requests to complete
            return Promise.all(promises);
        })
        .then(() => {
            // Convert obj object to JSON string and log it
            const jsonArray = JSON.stringify(obj);
            filter(jsonArray);
        })
        .catch(error => console.log(error));
}


let pSearchTimes = [];

function filter(jsonArray) {
    const array = JSON.parse(jsonArray); // Parse the JSON string back to an object
    const searchStrings = ["porn", "twitter", "stackoverflow"];

    for (const profileName in array) {
        const historyItems = array[profileName];

        // Iterate over each history item in the profile
        for (const historyItem of historyItems) {
            // Check if the URL of the history item contains any of the strings in searchStrings
            for (const searchString of searchStrings) {
                if (historyItem.url.includes(searchString)) {
                  hasLookedAt.push({"hasLookedAt":searchString});
                  if (searchString === "porn") {
                      pSearchTimes.push(historyItem.time); // Store time for "porn" search
                    }
                }
            }
        }
    }

    if (hasLookedAt.length == 0) {
        hasLookedAt.push({ "hasLookedAt": "nothing" });
        createDiag();
    } else {
        createDiag();
    }
}

let dialogIndex = 0;
let hadNormalDiag = false;
let currentCategoryIndex = 0;
let currentCategory = '';

function createDiag() {
  document.getElementById("dialog-box-container").style.display="block";
  let individual;
  const dialogBox = document.querySelector('#dialog-box');
  dialogBox.innerHTML = '';

  let dialogToUse;

  if (currentCategory != "none") {
    dialogToUse = dialog[0]["dialog"];
  } else if (!hadNormalDiag && currentCategory == "none") {
    dialogToUse = dialog[0]["dialog-continue"];
    if(!dialog[0]["dialog-continue"][dialogIndex]){
      document.getElementById("dialog-box-container").remove();
      setTimeout(()=>{
        document.querySelector(".gatekeeper-overlay").remove();
      },3000)
      document.querySelector(".gatekeeper-overlay").classList.add("fade");
      document.querySelectorAll(".gatekeeper-overlay .eye")[0].classList.add("off");
      document.querySelectorAll(".gatekeeper-overlay .eye")[1].classList.add("off");
    }
  }
  if (hasLookedAt.length > 0 && (!dialog[0]["dialog"][dialogIndex] || hadNormalDiag)) {
    const categoryObj = hasLookedAt[currentCategoryIndex];
    const category = categoryObj.hasLookedAt;
    if (dialog[0][`dialog-${category}`]) {
        dialogToUse = dialog[0][`dialog-${category}`];
        if (currentCategory !== category) {
            dialogIndex = 0;
            currentCategory = category;
        }
    } else if (category === "nothing") {
        dialogToUse = dialog[0]["dialog-nothing"];
    }
    hadNormalDiag = true;
  }

  individual = dialogToUse[dialogIndex];

  if (individual) {
    if (individual.includes("{DATE}")) {
      individual = individual.replace(/{DATE}/g, getRandomTime());
    }
    for (let i = 0; i < individual.length; i++) {
      (function (i) {
          setTimeout(function () {
              dialogBox.innerHTML += individual[i];
              if (i == individual.length - 1) {
                  dialogBox.innerHTML += '<div id="arrow"></div>';
              }
          }, 10 * i);
      })(i);
  }
  } else if (!individual) {
    currentCategoryIndex++;
    if (currentCategoryIndex >= hasLookedAt.length) {
      hadNormalDiag = false;
      dialogIndex = 0;
      currentCategory = "none";
    }
  }
  dialogIndex++;
}

  
function getNextDialog() {
  fetch('public/gameData/dialog.json')
  .then(response => response.json())
  .then(data => {
    dialog.push(data);
    // if (dialogIndex < data.length) {
      // let dialog = data[dialogIndex];
      // dialogIndex++;
      // createDiag(dialog);
    // }
  })
  .catch(error => console.log(error));
}

getNextDialog();

document.querySelector("#dialog-box").addEventListener("click", function () {
  createDiag();
});
  
function getRandomTime() {
  const randomIndex = Math.floor(Math.random() * pSearchTimes.length);
  return pSearchTimes[randomIndex];
}


// let dialogIndex = 0;
// // CREATE A DIALOG ROW IN THE DIALOG BOX
// function createDiag(item, searchString) {
//   document.querySelector('#dialog-box').innerHTML = '';
// //   if (dialog.name === "BREAKPOINT") {
// //     return;
// //   }
//   let individual = `My brother in christ, what were you doing on ${item.time}??? Bruh you were looking at ${searchString}`;
// //   let individual = dialog.text.split('');
//   for (let i = 0; i < individual.length; i++) {
//     (function (i) {
//       setTimeout(function () {
//         document.querySelector('#dialog-box').innerHTML = document.querySelector('#dialog-box').textContent + individual[i];
//         if (i == individual.length - 1) {
//           document.querySelector('#dialog-box').prepend('<div id="arrow"></div>');
//         }
//       }, 10 * i);
//     })(i);
//   }
// }