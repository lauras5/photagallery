
export function getNavbar() {
    // search bar?
    // categories?
    // tabs/li?
    const navContainer = document.getElementById('navbar');

    const nav_left = document.createElement('div');
    nav_left.classList.add('navbar__left');
    navContainer.appendChild(nav_left);

    const nav_logo = document.createElement('img');
    nav_logo.classList.add('navbar__logo');
    nav_left.appendChild(nav_logo);

    const nav_title = document.createElement('span');
    nav_title.innerText = "Photagallery";
    nav_title.classList.add('navbar__title');
    nav_left.appendChild(nav_title);

    // search bar / tabs ?
    const nav_right = document.createElement('div');
    nav_right.classList.add('navbar__right');
    navContainer.appendChild(nav_right);

}
