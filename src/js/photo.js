import Glide from '@glidejs/glide'

const glide = new Glide('.glide', {
    type: 'carousel',
    perView: 3,
    focusAt: 'center',
    gap: 5
});

glide.mount();
