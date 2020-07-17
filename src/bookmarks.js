'use strict';
import 'bootstrap';
import $ from 'jquery';
import './index.css';
import store from './store';
import api from './api';

function generateBookmarkElement(bookmark){
    return `    
    <div class="panel panel-default js-bookmark-element" data-item-id="${bookmark.id}">
    <div class="panel-heading" role="tab">
      <h4 class="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#${bookmark.id}" aria-expanded="false" aria-controls="${bookmark.id}">
          ${bookmark.title}
          </a>    
          <span class="bookmark-rating">${showStars(bookmark.rating)}</span>                          
      </h4>
      </div>
      <div id="${bookmark.id}" class="panel-collapse collapse" role="tabpanel">
      <div class="panel-body">
      <p data-id="${bookmark.id}">${bookmark.desc}</p>
      <p><a data-id="${bookmark.id}" target="_blank" href="${bookmark.url}">Visit Site</a></p>
      <button type="button" class="btn btn-danger js-bookmarkDelete" data-id="${bookmark.id}">Delete</button>
        </div>
      </div>      
    </div>       
`;
}

  function generateBookmarksListString(bookmarksList){
    const bookmarks = bookmarksList.map(bookmark => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }

  function showStars(numStar){
    const stars = '<span class="stars">🟊</span>';

    let currentString =' ';
    for (let i = 0; i < numStar; i++){
      currentString += stars;
    }
    return currentString;
  }

  function generateError(message) {
    return `
        <section class="error-content">
          <button id="cancelError">X</button>
          <p>${message}</p>
        </section>
      `;
  };
  
  const renderError = function () {
    if (store.error) {
      const el = generateError(store.error);
      $('.errorContainer').html(el);
    } else {
      $('.errorContainer').empty();
    }
  };
  
  function closeError(){
    $('.errorContainer').on('click', '#cancelError', () => {
      store.setError(null);
      renderError();
    });
  };

  function render(){
    renderError();
    let bookmarks = store.bookmarks.filter(bookmark => {
      return bookmark.rating >= store.minimumRating;
    });
    
    
    $('.js-bookmarksList').html(generateBookmarksListString(bookmarks));
  };

  function getItemIdFromElement(bookmark){
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('item-id');
  };

  function handleNewBookmarkSubmit(){
    $('#js-addBookmarkForm').submit(function(event){
      event.preventDefault();
      const values = {};
      values.title = $('#js-bookmarkName').val();
      values.url = $('#js-bookmarkURL').val();
      values.desc = $('#js-bookmarkDescription').val();
      values.rating = $('#js-bookmarkRating').val();
      //testing
      console.log(values);
      api.addBookmark(values)
        .then((newBookmark) => {
          store.addBookmark(newBookmark);
          render();
        })
        .catch((err) => {
          store.setError(err.message);
          renderError();
        });
    });
  };
  
  function handleBookmarkDeleteClicked(){
    $('.js-bookmarksList').on('click', '.js-bookmarkDelete', event => {
      const id = getItemIdFromElement(event.currentTarget);

      api.deleteBookmark(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        })
        .catch((err) => {
          console.log(err);
          store.setError(err.message);
          renderError();
        });
    });
  };


  
  function handleMinimumRatingFilter(){
    $('.js-bookmark-rating-filter').on('change', event => {
      let rating = $(event.target).val();
      store.minimumRating = rating;
      render();
    });
  };

  /* function collapseBookmark(event){
    var target = $( event.target );
    if ( target.is( "li" ) ) {
      target.children().toggle();
    }
  }

  $( "ul" ).click(collapseBookmark).find( "ul" ).hide();
  */

  function bindEventListeners(){
    closeError();
    handleNewBookmarkSubmit();
    handleBookmarkDeleteClicked();
    handleMinimumRatingFilter();
   // collapseBookmark();
  };

  export default {
      bindEventListeners,
      render
  };