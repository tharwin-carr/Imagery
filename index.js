'use strict'

const apiKey = '563492ad6f917000010000013b2715be52cb41c483e502e33f504956';
const curatedUrl = 'https://api.pexels.com/v1/curated?per_page=10&page=1';
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
    .then(response => response.json())
    .then(responseJson => {
        if(responseJson.total_results === 0) {
            noResults();
        } else {
            displayResults(responseJson, showMore);
        }
    })
    .catch(function (error){
        console.log(error);
        alert('Something went wrong! Try again Later')
    })
}

  //function for when no images are found
  function noResults() {
      $('#js-results').empty();
      $('#js-error-message').show();
  }


  //displays the search results to the DOM for the user
  function displayResults(responseJson, showMore = false) {
      if (showMore === false) {
          $('#js-results').empty();
      }

      for(let i=0; i < responseJson.photos.length; i++){
          $('#js-results').append(pictureTemplate(responseJson.photos[i].src.medium, responseJson.photos[i].photographer, responseJson.photos[i].url)
          )
        $('#js-error-message').hide();
    };
      }

      //HTML Template Generator for displayResults()
      function pictureTemplate(src, photographer, url) {
          return `
          <li><img class='image-result' src='${src}' alt='image_results'> <br> <div class='img-info'>
          <p class='photographer'>${photographer}</p> <a class='photographer-url' href='${url}' target_blank'>Download Photo</a></div>`
      }

      //scroll function to load more data as the user scrolls
      function showMore() {
        $(window).on("scroll", function() {
            let scrollHeight = $(document).height();
            let scrollPosition = $(window).height() + $(window).scrollTop();
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                // when scroll to bottom of the page
                let search = $('#js-search-term').val();
                    findPics(search, ++page, true);
            }
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