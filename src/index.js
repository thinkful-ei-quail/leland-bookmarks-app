'use strict';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import $ from 'jquery';

import './index.css';

import api from './api';
import store from './store';
import bookmarks from './bookmarks';

const main = function () {
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      
    });
   
  bookmarks.bindEventListeners();
  bookmarks.render();
};


$(main);