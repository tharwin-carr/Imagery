'use strict'

const apiKey = '563492ad6f917000010000013b2715be52cb41c483e502e33f504956';
const curatedUrl = `https://api.pexels.com/v1/curated`;
const searchUrl = 'https://api.pexels.com/v1/search';
let page = 1;

//formats the search items into the correct format
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

  //fetches the api for the startup screen and search items
  function findPics(query, pageNum, showMore = false) {
      const params = {
          query: query,
          page: +page,
          per_page: 10,
      }

      const queryStrings = formatQueryParams(params);
      const firstUrl = curatedUrl + '?' + queryStrings;
      const secondUrl = searchUrl + '?' + queryStrings;

      let pageNumber;
      let url;

      if(!pageNum) {
          pageNumber = 1;
      } else{
          pageNumber= pageNum;
      }


      if(!query) {
          url = firstUrl;
      } else {
          url = secondUrl;
      }

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
    
    .then(responseJson => displayResults(responseJson, showMore))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong. ${err.message}`);
    });
  }

  //displays the search results to the DOM for the user
  function displayResults(responseJson, showMore = false) {
      if (showMore === false) {
          $('#js-results').empty();
      }

      for(let i=0; i < responseJson.photos.length; i++){
          $('#js-results').append(`<li><img class='image-result' src='${responseJson.photos[i].src.medium}' alt='image_results'> <br>
          <p>${responseJson.photos[i].photographer}</p> <a class='photographer-url' href='${responseJson.photos[i].photographer_url}' target='_blank'>Photograger Website</a>
           </li>`
          )};
      }

      //shows more photos on the DOM when the 'show more' button is clicked
      function showMore() {
          $('#js-show-more-button').click(event => {
              let search = $('#js-search-term').val();
              findPics(search, ++page, true);
          });
      }

      function watchForm() {
          $('form').submit(event => {
              event.preventDefault();
              let search = $('#js-search-term').val();
              findPics(search);
          });
          showMore();
          findPics();
      }


      $(watchForm);