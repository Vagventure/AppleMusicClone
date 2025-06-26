const artist = document.body.dataset.artist;
let audio = new Audio();
let currentSong = null;

document.querySelector(".new").addEventListener('click', () => {
    window.location.href = "/new";
})

//secondstominutesconversion
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

//Listing songs
async function songlist() {
    let a = await fetch(`/NewReleases/${artist}/`)
    let b = await a.text()
    let div = document.createElement('div')
    div.innerHTML = b
    let anchors = div.getElementsByTagName('a')
    let array = Array.from(anchors)
    let count = 1;
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes(".mp3")) {
            let song = e.href.split("-").slice(0)[0].split("/")[5]
            let dsong = decodeURIComponent(song)
            // console.log(dsong)
            let list = document.querySelector(".list")
            let div = document.createElement('div')
            div.className = "songlt";
            div.innerHTML = `<p>${count}. ${dsong}</p>`;
            count = count + 1;
            list.appendChild(div);

        }

    }

}

async function songplayer() {
    document.querySelectorAll(".songlt").forEach(e => {
        e.addEventListener('click', async () => {
            // console.log(e);
            Musicplayer(e);
            seekbarinfo()
        })
    })
}

//playmusic function
const Musicplayer = (p) => {
    if (audio) {
        audio.pause();
    }
    let a = p.firstChild.innerHTML.split(".")[1].trim();
    console.log(a)
    let c = `/NewReleases/${artist}/${a} - ${artist}-.mp3`;
    // console.log(c)
    audio = new Audio(c);
    audio.play();
    console.log("playing")
    play.src = "/images/pause.svg";
    document.querySelector(".seekbar").firstElementChild.innerHTML = `<img src="/LatestSongs/${a} - ${artist}-.webp">`
    currentSong = p;
    // console.log(p);
}


//play-pause
let playbtn = document.querySelector(".controls img:nth-child(3)")
playbtn.addEventListener('click', () => {
    if (audio) {
        if (audio.paused) {
            audio.play();
            play.src = "/images/pause.svg";
        } else {
            audio.pause();
            play.src = "/images/play.svg";
        }
    }
})


//next song
next.addEventListener('click', () => {
    let pl = currentSong.nextElementSibling;
    if (pl) {
        Musicplayer(pl);
        seekbarinfo();
    } else {
        audio.pause();
        play.src = "/images/play.svg";
    }

})

//previous song
prev.addEventListener('click', () => {
    let pl = currentSong.previousElementSibling;
    if (pl) {
        Musicplayer(pl);
        seekbarinfo();
    } else {
        audio.pause();
        play.src = "/images/play.svg";
    }
})

//volume rocker
document.querySelector(".volume>input").addEventListener('change', (e) => {
    audio.volume = parseInt(e.target.value) / 100;
    console.log(audio.volume)
    if (audio.volume == 0) {
        vol.src = "/images/mute.svg"
    } else {
        vol.src = "/images/volume.svg"
    }
});

//mute switch
document.querySelector(".volume").firstElementChild.addEventListener('click', () => {
    if (audio.volume == 0) {
        audio.volume = 0.50;
        vol.src = "/images/volume.svg";
        document.querySelector(".volume").lastElementChild.value = 50;
    } else {
        vol.src = "/images/mute.svg";
        audio.volume = 0;
        document.querySelector(".volume").lastElementChild.value = 0;
    }
})

//seekbar control
const seekbarinfo = () => {
    let a = currentSong.firstChild.innerHTML.split(".")[1];
    document.querySelector(".playinfo").firstElementChild.innerHTML = a;
    audio.addEventListener('timeupdate', () => {
        document.querySelector(".playinfo").lastElementChild.innerHTML = `${secondsToMinutesSeconds(audio.currentTime)}/${secondsToMinutesSeconds(audio.duration)}`;
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
    })
    document.querySelector(".playcont").addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        audio.currentTime = ((audio.duration) * percent) / 100;
    })
}


async function init() {
    await songlist();
    songplayer();
}

init();

