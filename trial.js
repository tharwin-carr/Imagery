'use strict'

const searchUrl= 'https://api.pexels.com/v1/search';
const apiKey= '563492ad6f917000010000013b2715be52cb41c483e502e33f504956';
let page = 1;


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

  function displayResults(responseJson) {
    console.log(responseJson);
  
    $('#js-results').empty();
  
    for (let i=0; i<responseJson.photos.length; i++) {
      $('#js-results').append(`<li><img class='image-result' src='${responseJson.photos[i].src.large}' alt='image_results'> <br>
      <p>${responseJson.photos[i].photographer}</p> <a class='photographer-url' href='${responseJson.photos[i].photographer_url}' target='_blank'>Photograger Website</a>
       </li>`
      )};
  }

  function findPics(query, page) {
    const params = {
      query: query,
      page: +page,
      per_page: 10,
    };
  
    const queryString= formatQueryParams(params);
    const url= searchUrl + '?' + queryString;
  
    console.log(url);

    const options = {
        headers: new Headers ({
            Authorization: apiKey
        })
    }
  
    fetch(url, options)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
  
      throw new Error(response.statusText);
    })
  
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong. ${err.message}`);
    });
  }

  function moreImages() {
      $('#js-show-more-button').click(event => {
          let search = $('#js-search-term').val();
          findPics(search, ++page);
      });
  }



  function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm= $('#js-search-term').val();
      moreImages();
      findPics(searchTerm);
    });
  }


  



  $(watchForm);