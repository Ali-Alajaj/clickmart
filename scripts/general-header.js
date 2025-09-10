let drop = false;
document.querySelector('.js-hamburger-menu-button') 
  .addEventListener('click', () => {
    if (!drop) {
      drop = true;
      document.querySelector('.js-mobile-header')
        .classList.add('mobile-header-drop');
    } else {
      drop = false;
      document.querySelector('.js-mobile-header')
        .classList.remove('mobile-header-drop');
    }
  });

function searchUsingSearchBar() {
  const search = document.querySelector('.js-search-bar')
    .value.toLowerCase();

  window.location.href = `/?search=${search}`;
}

document.querySelector('.js-search-button')
  .addEventListener('click', () => {
    searchUsingSearchBar();
  });

document.querySelector('.js-search-bar')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      searchUsingSearchBar();
    }
  });

let nav = false;
document.querySelector('.js-filter-button')
  .addEventListener('click', () => {
    if (!nav) {
      nav = true;
      document.querySelector('.js-nav')
        .classList.add('nav-shown');
    } else {
      nav = false;
      document.querySelector('.js-nav')
        .classList.remove('nav-shown');
    }
  });

document.querySelector('.js-x-button')
  .addEventListener('click', () => {
    if (nav === true) {nav =  false};
    document.querySelector('.js-nav')
      .classList.remove('nav-shown');
  });