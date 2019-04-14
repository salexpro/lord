import 'whatwg-fetch';

class Music {
    constructor(url) {
        this.url = url;
    }
    async getAlbums(artistId) {
        try {
            let response = await fetch(`${this.url}?entity=album&sort=recent&limit=6&id=${artistId}`);
            let data = await response.json();
            return data;
        } catch (err) {
            throw new Error('Не удалось получить альбомы исполнителя');
        }
    }

    async getSongs(id) {
        try {
            let response = await fetch(`${this.url}?entity=song&limit=5&id=${id}`);
            let data = await response.json();
            return data;
        } catch (err) {
            throw new Error('Не удалось получить песни');
        }
    }

    renderAlbums(albums) {
        const albumsContainer = document.getElementById('albums');
        const albumsHtml = albums.reduce((html, album) =>
            `${html}
            ${(album.wrapperType == 'collection') ?
                `<div class="music_album" data-albumid="${album.collectionId}">
                    <img src="${album.artworkUrl100.replace('100x100', '360x360')}" alt="${album.collectionName}">
                </div>`
            : ''}`
        , '');

        albumsContainer.innerHTML = `<div class="music_albums">${albumsHtml}</div>`;
    }

    renderSongs(songs, isFirstLoad = false) {
        const songsContainer = document.getElementById('songs');
        const songsHtml = songs.reduce((html, song) =>
            `${html}
            ${(song.wrapperType == 'track') ? 
                `<div class="music_song" data-preview="${song.previewUrl}" data-songid="${song.trackId}" data-cover="${song.artworkUrl100.replace('100x100', '200x200')}" data-songname="${song.trackName}">
                    <div class="music_song_cover">
                        <img src="${song.artworkUrl100.replace('100x100', '200x200')}" alt="${song.trackName}">
                        <button class="music_song_play">
                    </div>
                    <div class="music_song_info">
                        <div class="music_song_title">${song.trackName}</div>
                        <div class="music_song_artist">${song.artistName}</div>
                    </div>
                    <a class="button secondary" href="${song.trackViewUrl}" target="_blank">iTunes</a>
                </div>`
                : ''}`
        , '');
        if(!isFirstLoad) songsContainer.setAttribute('data-albumid', songs[1].collectionId);
        songsContainer.innerHTML = songsHtml;
    }
}

export { Music };
