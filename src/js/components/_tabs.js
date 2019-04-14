const switchTab = activeTab => {
    document.querySelectorAll('.tabs-title').forEach(el => {el.firstChild.removeAttribute('aria-selected')})
    document.querySelectorAll('.tabs-panel').forEach(el => {el.classList.remove('is_active')})
    document.querySelector(activeTab.getAttribute('href')).classList.add('is_active');
    activeTab.setAttribute('aria-selected', 'true');
}

const tabs = document.querySelector('.tabs');
if (tabs) {
    tabs.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.nodeName === 'A') switchTab(e.target);
    })
}

export { switchTab };