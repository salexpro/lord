// eslint-disable-next-line no-unused-vars
import polyfill from '@babel/polyfill';
import svg4everybody from 'svg4everybody';
// import './lib/foundation-explicit-pieces';
import { switchTab } from './components/_tabs';
import { Music } from './components/_music';
import './components/_player';

svg4everybody();

(async () => {
    let music = new Music('https://itunes.apple.com/lookup');
    const artistId = 30865945;
    
    try {
        const albums = await music.getAlbums(artistId);
        music.renderAlbums(albums.results);
        
        const songs = await music.getSongs(artistId);
        music.renderSongs(songs.results, true);
        
        document.querySelector('.music_albums').addEventListener('click', async (e) => {
            if (e.target.classList.contains('music_album')) {
                const albumId = e.target.getAttribute('data-albumid');
                if (albumId != document.getElementById('songs').getAttribute('data-albumid')) {
                    e.target.classList.add('is_loading');
                    const songs = await music.getSongs(albumId);
                    e.target.classList.remove('is_loading');
                    music.renderSongs(songs.results);
                }
                switchTab(document.querySelector('[href="#songs"]'));
            }
        });

    } catch (err) {
        console.error(err);
    }
})();