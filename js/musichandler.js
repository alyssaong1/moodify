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
