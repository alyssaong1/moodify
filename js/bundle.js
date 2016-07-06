(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Format code is shift alt f
// tsc js/*.ts --watch
// browserify main.js -o bundle.js
// watchify main.js -o bundle.js -v
"use strict";
var mood = require("./moodhandler");
var music = require("./musichandler");
var currentMood;
// Initialise playlist and soundcloud
music.init();
// Get elements from DOM
var imgSelector = document.getElementById("my-file-selector");
var refreshbtn = document.getElementById("refreshbtn");
var pageheader = document.getElementById("page-header");
var pagecontainer = document.getElementById("page-container");
// Register button listeners
imgSelector.addEventListener("change", function () {
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
    var img = document.getElementById("selected-img");
    img.src = currentMood.emoji;
    img.style.display = "block";
    //Display song refresh button
    refreshbtn.style.display = "inline";
    //Remove offset at the top
    pagecontainer.style.marginTop = "20px";
}
function processImage(callback) {
    var file = imgSelector.files[0];
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        // If the file isn't an image, can skip this step for simplicity
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
            callback(file);
        }
    };
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
        if (data.length != 0) {
            // Get the emotion scores
            var scores = data[0].scores;
            callback(scores);
        }
        else {
            pageheader.innerHTML = "Hmm, we can't detect a human face in that photo. Try another?";
        }
    })
        .fail(function (error) {
        pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
        console.log(error.getAllResponseHeaders());
    });
}

},{"./moodhandler":2,"./musichandler":3}],2:[function(require,module,exports){
"use strict";
var Mood = (function () {
    function Mood(mood, emojiurl) {
        this.mood = mood;
        this.emojiurl = emojiurl;
        this.name = mood;
        this.emoji = emojiurl;
    }
    return Mood;
}());
exports.Mood = Mood;
//better as a hashmap but w/e
var happy = new Mood("happy", "http://emojipedia-us.s3.amazonaws.com/cache/a0/38/a038e6d3f342253c5ea3c057fe37b41f.png");
var sad = new Mood("sad", "https://cdn.shopify.com/s/files/1/1061/1924/files/Sad_Face_Emoji.png?9898922749706957214");
var angry = new Mood("angry", "https://cdn.shopify.com/s/files/1/1061/1924/files/Very_Angry_Emoji.png?9898922749706957214");
var neutral = new Mood("neutral", "https://cdn.shopify.com/s/files/1/1061/1924/files/Neutral_Face_Emoji.png?9898922749706957214");
function getCurrMood(scores) {
    var currentMood;
    // Easier to do this in demos than get the max
    if (scores.happiness > 0.4) {
        currentMood = happy;
    }
    else if (scores.sadness > 0.4) {
        currentMood = sad;
    }
    else if (scores.anger > 0.4) {
        currentMood = angry;
    }
    else {
        currentMood = neutral;
    }
    return currentMood;
}
exports.getCurrMood = getCurrMood;

},{}],3:[function(require,module,exports){
"use strict";
var Song = (function () {
    function Song(songtitle, songurl) {
        this.songtitle = songtitle;
        this.songurl = songurl;
        this.title = songtitle;
        this.url = songurl;
    }
    return Song;
}());
var Playlist = (function () {
    function Playlist() {
        this.happy = [];
        this.sad = [];
        this.angry = [];
    }
    Playlist.prototype.addSong = function (mood, song) {
        if (mood === "happy") {
            this.happy.push(song);
        }
        else if (mood === "sad") {
            this.sad.push(song);
        }
        else if (mood === "angry") {
            this.angry.push(song);
        } // do a default one as well
    };
    Playlist.prototype.getRandSong = function (mood) {
        if (mood === "happy" || mood === "neutral") {
            return this.happy[Math.floor(Math.random() * this.happy.length)];
        }
        else if (mood === "sad") {
            return this.sad[Math.floor(Math.random() * this.sad.length)];
        }
        else if (mood === "angry") {
            return this.angry[Math.floor(Math.random() * this.angry.length)];
        } // switch statements would probably work better but if statements better to start with
    };
    return Playlist;
}());
exports.Playlist = Playlist;
var myPlaylist = new Playlist();
function init() {
    // init playlist
    myPlaylist.addSong("happy", new Song("Animals", "https://soundcloud.com/martingarrix/martin-garrix-animals-original"));
    myPlaylist.addSong("happy", new Song("Good feeling", "https://soundcloud.com/anderia/flo-rida-good-feeling"));
    myPlaylist.addSong("happy", new Song("Megalovania", "https://soundcloud.com/angrysausage/toby-fox-undertale"));
    myPlaylist.addSong("happy", new Song("On top of the world", "https://soundcloud.com/interscope/imagine-dragons-on-top-of-the"));
    myPlaylist.addSong("sad", new Song("How to save a life", "https://soundcloud.com/jelenab-1/the-fray-how-to-save-a-life-7"));
    myPlaylist.addSong("sad", new Song("Divenire", "https://soundcloud.com/djsmil/ludovico-einaudi-divenire"));
    myPlaylist.addSong("sad", new Song("Stay High", "https://soundcloud.com/musaradian/our-last-night-habitsstay-hightove-lo"));
    myPlaylist.addSong("angry", new Song("When they come for me", "https://soundcloud.com/heoborus/when-they-come-for-me-linkin-park"));
    myPlaylist.addSong("angry", new Song("One Step Closer", "https://soundcloud.com/user1512165/linkin-park-one-step-closer"));
    myPlaylist.addSong("angry", new Song("Somewhere I belong", "https://soundcloud.com/mandylinkinparkmusic2xd/somewhere-i-belong"));
    // init soundcloud
    initSC();
}
exports.init = init;
function loadSong(currentMood) {
    var songSelected = myPlaylist.getRandSong(currentMood.name);
    var track_url = songSelected.url;
    document.getElementById("track-name").innerHTML = "Have a listen to: " + songSelected.title;
    document.getElementById("track-name").style.display = "block";
    document.getElementById("musicplayer").style.display = "block";
    loadPlayer(track_url);
}
exports.loadSong = loadSong;
var myClientId = "8f2bba4a309b295e1f74ee38b8a5017b";
function initSC() {
    // init soundcloud
    SC.initialize({
        client_id: myClientId
    });
}
function loadPlayer(trackurl) {
    SC.oEmbed(trackurl, { auto_play: true }).then(function (oEmbed) {
        var div = document.getElementById("musicplayer");
        div.innerHTML = oEmbed.html;
    });
}

},{}]},{},[1]);
