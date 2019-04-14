import WaveSurfer from 'wavesurfer.js';


class Player {
    constructor(options) {
        this.audio = this.isWebAudio() ? WaveSurfer.create(options) : new Audio();
        this.playerStartTime = document.getElementById('playerStartTime');
        this.playerEndTime = document.getElementById('playerEndTime');
        this.playerLoaded = document.getElementById('playerLoaded');
    }
    isWebAudio() {
        return (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined' || typeof mozAudioContext !== 'undefined');
        // return false;
    }
    playPause(forcePlay) {
        if (this.isWebAudio()) {
            this.audio.playPause()
            if(this.audio.getCurrentTime() == 0) this.audio.setVolume(0);
        } else if (this.audio.paused || forcePlay) {
            this.audio.play()
            if(this.audio.currentTime == 0) this.audio.volume = 0;
        } else {
            this.audio.pause()
        }
    }
    load(song) {
        if (this.isWebAudio()) {
            this.audio.load(song);
        } else {
            this.audio.setAttribute('src', song);
            playerWaves.classList.add('is_native');
            document.getElementById('playerPlayed').style.width = 0;
            // this.audio.play();
            // setTimeout(() => {this.audio.pause()}, 10);
        }
    }
    resetTime() {
        this.playerStartTime.innerText = '00:00';
        this.playerEndTime.innerText = '00:00';
    }
    updateCurrTime() {
        const currTime = this.isWebAudio() ? this.audio.getCurrentTime() : this.audio.currentTime;
        this.playerStartTime.innerText = `00:${(Math.floor(currTime) < 10) ? `0${Math.floor(currTime)}` : Math.floor(currTime)}`;
        if (!this.isWebAudio()) {
            document.getElementById('playerPlayed').style.width = `${Math.floor(100 * currTime / this.audio.duration)}%`;
        }

        // fadeIn
        if ((currTime <= 2)) {
            const newVolume = (currTime / 2).toFixed(1);
            if (this.isWebAudio()) {
                this.audio.setVolume(newVolume);
            } else {
                this.audio.volume = newVolume;
            }
        }

        // fadeOut
        const fadePoint = this.isWebAudio() ? this.audio.getDuration() - 2 : this.audio.duration - 2; 
        const duration = this.isWebAudio() ? this.audio.getDuration() : this.audio.duration;
        const currVolume = this.isWebAudio() ? this.audio.getVolume() : this.audio.volume;
        // Only fade if past the fade out point or not at zero already
        if ((currTime >= fadePoint) && (currVolume > 0)) {
            const newVolume = ((duration - currTime) / 2).toFixed(1);

            if (this.isWebAudio()) {
                this.audio.setVolume(newVolume);
            } else {
                this.audio.volume = newVolume;
            }
        }
        // console.log(currVolume);
    }
    setEndTime() {
        const duration = this.isWebAudio() ? this.audio.getDuration() : this.audio.duration;
        this.playerEndTime.innerText = '00:' + Math.floor(duration);
    }
    setSongId(id) {
        this.songid = id;
    }
    getSongId() {
        return this.songid;
    }
    listen(event, func) {
        const nativeEvent = {
            loading: 'loadstart',
            ready: 'canplaythrough',
            play: 'play',
            pause: 'pause',
            finish: 'ended',
            audioprocess: 'timeupdate',
        }
        const pureEvent = this.isWebAudio() ? event : nativeEvent[event];
        if (this.isWebAudio()) {
            this.audio.on(pureEvent, func);
        } else {
            this.audio.addEventListener(pureEvent, func);
        }
    }
    progressUpdate(progress) {
        if (this.isWebAudio()) {
            this.playerLoaded.style.width = `${progress}%`;
            if (progress == 100) {
                playerWaves.classList.add('is_loaded');
                this.playerLoaded.style.width = 0;
            }
        } else {
            const progressChecker = setInterval(() => {
                playerWaves.classList.remove('is_loaded');
                const buffered = player.audio.buffered;
                if (buffered.length) {
                    const loaded = 100 * buffered.end(0) / player.audio.duration;
                    this.playerLoaded.style.width = `${loaded}%`;
                    if (loaded >= 99.99) {
                        clearInterval(progressChecker);
                        playerWaves.classList.add('is_loaded');
                        this.playerLoaded.style.width = 0;
                    }
                }
            }, 200);
        }
    }
    seek(percent) {
        const time = percent * this.audio.duration / 100;
        this.audio.currentTime = time;
        this.audio.volume = 1;
    }
}


const player = new Player({
    container: '#waveform',
    waveColor: 'rgba(255,255,255, 0.2)',
    progressColor: '#fecc74',
    height: 36,
    barWidth: 1,
    barGap: 4,
    responsive: true,
    cursorWidth: 0
})


const playerContainer = document.querySelector('.player');
const playerCover = document.getElementById('playerCover');
const playerWaves = document.querySelector('.player_waves');
const playButton = document.getElementById('playerButton');

player.listen('loading', progress => {
    player.progressUpdate(progress);
})

player.listen('ready', () => {
    playButton.removeAttribute('disabled');
    player.setEndTime();
    player.playPause(true); 
})

player.listen('play', () => {
    playButton.classList.add('is_playing');
})

player.listen('pause', () => {
    playButton.classList.remove('is_playing');
})
player.listen('finish', () => {
    playButton.classList.remove('is_playing');
    Array.from(document.querySelectorAll('.music_song')).forEach(el => el.classList.remove('is_playing'));
})

player.listen('audioprocess', () => {
    player.updateCurrTime();
    
    const currSong = document.querySelector(`[data-songid="${player.getSongId()}"]`);
    if(currSong) currSong.classList.add('is_playing');
})

if (player.isWebAudio()) {
    player.audio.on('seek', () => {
        player.audio.setVolume(1);
    });
} else {
    document.getElementById('waveform').addEventListener('click', function(e) {
        const percent = (e.clientX - this.parentNode.offsetLeft) / this.offsetWidth * 100;
        player.seek(percent);
    })
}

playButton.addEventListener('click', () => {
    player.playPause()
})

const songs = document.querySelector('#songs');
if (songs) {
    songs.addEventListener('click', e => {
        if (e.target.className === 'music_song_play') {
            const currSong = e.target.parentNode.parentNode;

            playerCover.setAttribute('src', currSong.getAttribute('data-cover'));
            playerCover.setAttribute('alt', currSong.getAttribute('data-songname'));
            playerContainer.classList.remove('is_hidden');
            playButton.setAttribute('disabled', 'disabled');
            playerWaves.classList.remove('is_loaded');

            player.resetTime();
            player.load(currSong.getAttribute('data-preview'));
            player.setSongId(currSong.getAttribute('data-songid'));

            Array.from(document.querySelectorAll('.music_song')).forEach(el => el.classList.remove('is_playing'));
            document.querySelector(`[data-songid="${player.getSongId()}"]`).classList.add('is_playing');
        }
    })
}