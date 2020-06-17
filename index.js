'use strict'

const searchUrl= 'https://api.pexels.com/v1/search';
const apiKey= '563492ad6f917000010000013b2715be52cb41c483e502e33f504956';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

  function displayResults(responseJson) {
    console.log(responseJson);
  
    $('#js-results').empty();
  
    for (let i=0; i<responseJson.data.length; i++) {
      $('#js-results').append(`<li>${responseJson.photos[i]}${responseJson.photos[i].url}`
      )};
  
      $('#js-results').removeClass('hidden');
  }

  function showPics(query) {
    const params = {
      api_key: apiKey,
      query: query,      
    };
  
    const queryString= formatQueryParams(params);
    const url= searchUrl + '?' + queryString;
  
    console.log(url);
  
    fetch(url,
        {method:'GET',
    headers:{
        Accept:'aplicatin/json',
        Authoriztion: apiKey
    }
    }
    ) .then(response => {
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

  function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm= $('#js-search-term').val();
      showPics(searchTerm);
    });
  }
  
  $(watchForm);