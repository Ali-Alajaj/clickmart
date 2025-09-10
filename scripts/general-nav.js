document.querySelector('.js-filter-search-button')
  .addEventListener('click', () => {
    let filteredtypes = '';
    document.querySelectorAll('.js-filter-checkbox')
      .forEach((checkbox) => {
        if (checkbox.checked === true) {
          filteredtypes += checkbox.dataset.type;
        }
      });
    window.location.href = `/?filteredtypes=${filteredtypes}`;
  });