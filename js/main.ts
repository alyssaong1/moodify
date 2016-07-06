// Format code is shift alt f
// tsc js/*.ts --watch
// browserify main.js -o bundle.js
// watchify main.js -o bundle.js -v

import * as mood from "./moodhandler";
import * as music from "./musichandler";

let currentMood: mood.Mood;

// Initialise playlist and soundcloud
music.init();

// Get elements from DOM
let imgSelector = document.getElementById("my-file-selector");
let refreshbtn = document.getElementById("refreshbtn");
let pageheader = document.getElementById("page-header");
let pagecontainer = document.getElementById("page-container");

// Register button listeners
imgSelector.addEventListener("change", function () { // file has been picked
    pageheader.innerHTML = "Just a sec while we analyse your mood...";
    processImage(function (file) {
        // Get emotions based on image
        sendEmotionRequest(file, function (emotionScores) {
            // Find out most dominant emotion
            currentMood = mood.getCurrMood(emotionScores);
            changeUI();
            // Load random song based on mood
            music.loadSong(currentMood);
        });
    });
});

refreshbtn.addEventListener("click", function () {
    // Load random song based on mood
    music.loadSong(currentMood);
});

function changeUI() {
    //Show detected mood
    pageheader.innerHTML = "Your mood is: " + currentMood.name;
    //Show mood emoji
    let img = document.getElementById("selected-img");
    img.src = currentMood.emoji;
    img.style.display = "block";
    //Display song refresh button
    refreshbtn.style.display = "inline";
    //Remove offset at the top
    pagecontainer.style.marginTop = "0px";
}

function processImage(callback) {
    let file = imgSelector.files[0]; 
    let reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    } else {
        console.log("Invalid file");
    }
    reader.onloadend = function () { 
        // If the file isn't an image, can skip this step for simplicity
        if (!file.name.match(/\.(jpg|jpeg|png)$/)){
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        } else {
            callback(file);
        }
    }
}

// Refer to http://stackoverflow.com/questions/35565732/implementing-microsofts-project-oxford-emotion-api-and-file-upload
// and code snippet in emotion API documentation
function sendEmotionRequest(file, callback) {
    $.ajax({
        url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "d342c8d19d4e4aafbf64ed9f025aecc8");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
            if (data.length != 0) { // if a face is detected
                // Get the emotion scores
                let scores = data[0].scores;
                callback(scores);
            } else {
                pageheader.innerHTML = "Hmm, we can't detect a human face in that photo. Try another?";
            }
        })
        .fail(function (error) {
            pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
            console.log(error.getAllResponseHeaders());
        });
}
