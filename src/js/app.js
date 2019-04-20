import svg4everybody from 'svg4everybody';

const offcanvas = document.getElementById('menu');
const offcanvasOverlay = document.querySelector('.js-off-canvas-overlay');

const openOffcanvas = () => {
    offcanvas.classList.add('is-open');
    offcanvas.setAttribute('aria-hidden', true);
    offcanvasOverlay.classList.add('is-visible');
}

const closeOffcanvas = () => {
    offcanvasOverlay.classList.remove('is-visible');
    offcanvas.removeAttribute('aria-hidden');
    offcanvas.classList.remove('is-open');
}

document.querySelector('.header_hamb').addEventListener('click', openOffcanvas)

offcanvasOverlay.addEventListener('click', closeOffcanvas)
document.querySelector('[data-close]').addEventListener('click', closeOffcanvas)

svg4everybody();