/* global YT */
// const videoButton = document.getElementById('videoPlayPause');

// videoButton.addEventListener('click', function () {
//     this.classList.toggle('is_paused')
//     player.playVideo();
// })

let player = false;
const videoPlayer = document.querySelector('.video_player');
const videoPlayerImg = document.querySelector('.video_player_img');

const onPlayerReady = () => {
    Array.from(document.querySelectorAll('.video_item--small')).forEach(video => {
        video.addEventListener('click', () => {
            const currId = video.getAttribute('data-id');
            const playerId = videoPlayer.getAttribute('data-id')
        
            videoPlayer.setAttribute('data-id', currId);
            videoPlayerImg.firstChild.setAttribute('src', `https://img.youtube.com/vi/${currId}/maxresdefault.jpg`)
            player.loadVideoById(currId);
            player.stopVideo();

            video.setAttribute('data-id', playerId);
            video.firstChild.setAttribute('src', `https://img.youtube.com/vi/${playerId}/maxresdefault.jpg`)
        })
    });
}

const ytready = () => {
    player = new YT.Player('videoPlayer', {
        videoId: videoPlayer.getAttribute('data-id'),
        playerVars: {
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady
        },
    });
}

export { ytready };