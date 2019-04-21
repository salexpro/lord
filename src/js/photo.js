import Glide from '@glidejs/glide'

const glide = new Glide('.glide', {
    type: 'carousel',
    perView: (window.outerWidth < 640) ? 1 : 3,
    focusAt: 'center',
    gap: 5
});

glide.mount();

const reBuild = currWidth => {
    if (currWidth < 1024 && currWidth >= 640 && !glide.disabled) {
        glide.update({ type: 'slider' });
        glide.disable();
    } else if ((currWidth >= 1024 || currWidth < 640) && glide.disabled) {
        glide.update({ type: 'carousel', perView: (window.outerWidth < 640) ? 1 : 3 });
        glide.enable()
    }
}

window.addEventListener('resize', () => {
    reBuild(window.outerWidth);
})

reBuild(window.outerWidth);