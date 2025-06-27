let audio = new Audio();
let currentSong = null;

const explore = [
    ["Browse by Genre", "Worldwide", "Spatial Audio"],
    ["Decades", "Charts", "Moods and Activities"],
    ["Music Videos"],
]

const songphotos = [
    "Alvida - KK-.webp",
    "Aye Khuda - Salim Merchant-.webp",
    "Chaand Se Parda - Kumar Sanu-.webp",
    "Chura liya hai tumne jo dil ko - Mohammed Rafi-.webp",
    "Kya hua tera vada - Mohammed Rafi-.webp",
    "Main koi aisa geet gaoon - Abhijeet-.webp",
    "Night Changes - One Direction-.webp",
    "Numb - Linkin Park-.webp",
    "Sky full of Stars - Coldplay-.webp",
    "Tum se hi - Mohit Chauhan-.webp",
    "What is Love - Haddaway-.webp",
    "Yeh vaada rha - Kishore Kumar-.webp",
];


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

//playmusic function
const Musicplayer = (p) => {
    if (audio) {
        audio.pause();
    }
    let a = p.querySelector(".songinfo").firstElementChild.innerHTML.trim();
    console.log(a)
    let b = p.querySelector(".songinfo").lastElementChild.innerHTML.trim();
    console.log(b);
    let c = `/LatestSongs/${a} - ${b}-.mp3`;
    console.log(c)
    audio = new Audio(c);
    audio.play();
    console.log("playing")
    play.src = "/images/pause.svg";
    document.querySelector(".seekbar").firstElementChild.innerHTML = `<img src="/LatestSongs/${a} - ${b}-.webp">`
    currentSong = p;
    console.log(p);
}


//Latest songs
let songs = document.querySelector(".Sgrid")
for (let index = 0; index < songphotos.length; index++) {
    const e = songphotos[index];
    let div = document.createElement('div')
    div.className = "song"
    div.innerHTML = `  
                        <span class="songimg">
                            <img width="45px" src="/LatestSongs/${e}">
                        </span>
                        <div class="songinfo">
                            <p class="cursor">${e.split('-')[0]}</p>
                            <p class="cursor">${e.split('-')[1]}</p>
                        </div>
                     <svg xmlns="http://www.w3.org/2000/svg" class="cursor" width="24" height="24" fill="#FA586A" viewBox="0 0 24 24">
                     <circle cx="5" cy="12" r="2"/>
                     <circle cx="12" cy="12" r="2"/>
                     <circle cx="19" cy="12" r="2"/>
                     </svg>
                
                    `
    songs.appendChild(div)

}


//More to explore
let more = document.querySelectorAll('.explorelist')
// console.log(more)
for (let index = 0; index < explore.length; index++) {
    const e = explore[index];
    const d = more[index]

    for (let j = 0; j < e.length; j++) {
        const item = e[j];
        let div = document.createElement('div')
        div.className = "explore"
        div.innerHTML = `
                              <p>${item}</p><img src="/images/arrow-right.svg">
                              `
        d.appendChild(div)
    }

}

async function displayradio() {
    let a = await fetch("/FM/")
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');

    let radio = document.querySelector(".albcout1")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/FM/")) {
            let folder = e.href.split("/").slice(-1)[0]
            // console.log(folder)
            let a = await fetch(`/FM/${folder}/info.json`)
            let response = await a.json();
            // console.log(response);
            // bt = 1;
            radio.innerHTML += `<div class="album"><img src ="/FM/${folder}/cover.webp"><span>${response.title}</span>
                                <br>
                               <span>Apple Music</span></div>`
            // bt++;

        }
    }
    document.querySelectorAll(".albcout1 > .album").forEach(e => {
        e.addEventListener('click', async () => {
            let title = e.getElementsByTagName('span')[0].innerHTML;
            console.log(title)
            if (e) {
                window.location.href = `/FM/${title}`;
            }

        });
    });

}

async function displayreleases() {
    let a = await fetch("/NewReleases/")
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');

    let radio = document.querySelector(".albcout2")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/NewReleases/")) {
            let folder = e.href.split("/").slice(-1)[0]

            let a = await fetch(`/NewReleases/${folder}/info.json`)
            let response = await a.json();
            // console.log(response);
            // bt = 1;
            radio.innerHTML += `<div class="album"><img src ="/NewReleases/${folder}/cover.webp"><span>${response.title}</span>
                                <br>
                               <span>Apple Music</span></div>`
            // bt++;

        }
    }
    document.querySelectorAll(".albcout2 > .album").forEach(e => {
        e.addEventListener('click', async () => {
            let title = e.getElementsByTagName('span')[0].innerHTML;
            console.log(title)
            if (e) {
                window.location.href = `/Playlist/${title}`;
            }

        });
    });


}

//songsplayer
async function songplayer() {
    document.querySelectorAll(".song").forEach(e => {
        // console.log(e)
        e.addEventListener('click', async () => {
            Musicplayer(e);
            seekbarinfo();

        })
    })

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

//seekbar 
const seekbarinfo = () => {
    let a = currentSong.querySelector(".songinfo").firstElementChild.innerHTML;
    document.querySelector(".playinfo").firstElementChild.innerHTML = a;
    audio.addEventListener('timeupdate', () => {
        document.querySelector(".playinfo").lastElementChild.innerHTML = `${secondsToMinutesSeconds(audio.currentTime)}/${secondsToMinutesSeconds(audio.duration)}`;
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
        if (audio.currentTime == audio.duration) {
            // play.src = "/images/play.svg";
            let pl = currentSong.nextElementSibling;
            if (pl) {
                Musicplayer(pl);
                seekbarinfo();
            }
        }
    })
    document.querySelector(".playcont").addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        audio.currentTime = ((audio.duration) * percent) / 100;
    })
}


// document.body.addEventListener("click", (e) => {
//    const album = e.target.closest(".album");
//    let title= album.getElementsByTagName('span')[0].innerHTML;
//    console.log(title)
//     if (album) {
//         window.location.href = `/Playlist/${title}`;
//     }
// });

//Login - Registor box
document.querySelector(".login-btn").addEventListener('click', () => {
    let a = document.querySelector(".Login-Section")
    console.log(a)
    let div = document.createElement('div')
    div.className = "registory"

    div.innerHTML = `  
                <img class="cancel cursor" src="/images/cancel.svg">
                <img src="/images/logo.svg">
                <h1>Sign in or Sign up</h1>
                <h3>Enter your email address to get started.</h3>
                <input id="User" type="text" placeholder="Enter your email address">
                <input id="Pass" type="text" placeholder="Enter your password">
                <p>Your Apple Account information is used to allow you to sign in securely and access your data. Apple records certain data for security, support and reporting purposes. If you agree, Apple may also use your Apple Account information to send you marketing emails and communications, including based on your use of Apple services.</p>
                <button class="submit cursor">Continue</button>
                
                `
    a.appendChild(div)

    document.querySelector(".cancel").addEventListener('click', () => {
        let a = document.querySelector(".Login-Section")
        a.removeChild(div)
    })
    
    // Account details saver
    document.querySelector(".submit").addEventListener('click', async () => {
        let username = document.getElementById("User").value
        let userpass = document.getElementById("Pass").value
        let r = await fetch("http://localhost:5000/", {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify({username,userpass })
        })
        console.log("Post request sent")
    })
})




displayradio()
displayreleases()
songplayer()