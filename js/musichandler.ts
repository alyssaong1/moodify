
class Song {
    title: string;
    url: string;
    constructor(public songtitle, public songurl) {
        this.title = songtitle;
        this.url = songurl;
    }
}

export class Playlist {
    // Hashmaps would be ideal for this but arrays easier to teach
    happy: Song[];
    sad: Song[];
    angry: Song[];
    constructor() {
        this.happy = [];
        this.sad = [];
        this.angry = [];
    }
    addSong(mood, song) {
        if (mood === "happy") {
            this.happy.push(song);
        } else if (mood === "sad") {
            this.sad.push(song);
        } else if (mood === "angry") {
            this.angry.push(song);
        } // do a default one as well
    }
    getRandSong(mood) {
        if (mood === "happy" || mood === "neutral") {
            return this.happy[Math.floor(Math.random() * this.happy.length)];
        } else if (mood === "sad") {
            return this.sad[Math.floor(Math.random() * this.sad.length)];
        } else if (mood === "angry") {
            return this.angry[Math.floor(Math.random() * this.angry.length)];
        } // switch statements would probably work better but if statements better to start with
    }
}

let myPlaylist = new Playlist();

export function init() {
    // init playlist
    myPlaylist.addSong("happy", new Song("Angels", "https://soundcloud.com/vicetone/angels"));
    myPlaylist.addSong("happy", new Song("Happy", "https://soundcloud.com/kaytranada/happy-kaytranada-edition"));
    myPlaylist.addSong("happy", new Song("Megalovania", "https://soundcloud.com/angrysausage/toby-fox-undertale"));
    myPlaylist.addSong("happy", new Song("It's time", "https://soundcloud.com/imaginedragons/its-time-imagine-dragons"));
    myPlaylist.addSong("sad", new Song("Curse of the sad mummy", "https://soundcloud.com/leagueoflegends/the-curse-of-the-sad-mummy"));
    myPlaylist.addSong("sad", new Song("Divenire", "https://soundcloud.com/djsmil/ludovico-einaudi-divenire"));
    myPlaylist.addSong("sad", new Song("Stay High", "https://soundcloud.com/musaradian/our-last-night-habitsstay-hightove-lo"));
    myPlaylist.addSong("angry", new Song("In the end", "https://soundcloud.com/user1512165/linkin-park-in-the-end-remix"));
    myPlaylist.addSong("angry", new Song("One Step Closer", "https://soundcloud.com/user1512165/linkin-park-one-step-closer"));
    myPlaylist.addSong("angry", new Song("Somewhere I belong", "https://soundcloud.com/mandylinkinparkmusic2xd/somewhere-i-belong"));
    // init soundcloud
    initSC();
}
export function loadSong(currentMood) {
    let songSelected = myPlaylist.getRandSong(currentMood.name);
    let track_url = songSelected.url;
    document.getElementById("track-name").innerHTML = "Have a listen to: " + songSelected.title;
    document.getElementById("track-name").style.display = "block";
    document.getElementById("musicplayer").style.display = "block";
    loadPlayer(track_url);
}

const myClientId = "8f2bba4a309b295e1f74ee38b8a5017b";
function initSC() {
    // init soundcloud
    SC.initialize({
        client_id: myClientId
    });
}
function loadPlayer(trackurl) {
    SC.oEmbed(trackurl, { auto_play: true }).then(function (oEmbed) {
        let div = document.getElementById("musicplayer");
        div.innerHTML = oEmbed.html;
    });
}