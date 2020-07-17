'use strict';
import 'bootstrap';


 
  
    const findById = function(id){
      return this.bookmarks.find(bookmark => bookmark.id === id);
    };
    
    const addBookmark = function(bookmark){
      this.bookmarks.push(bookmark);
    };
  
    const findAndUpdate = function(id, newData){
      const bookmark = this.findById(id);
      Object.assign(bookmark, newData);
    };
  
    const findAndDelete = function(id){
      this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
    };

    const setError = function(error) {
        this.error = error;
      };
  
    export default {
      bookmarks: [],
      minimumRating: 0,
      collapsedStates:{},
      setError,
      addBookmark,
      findById,
      findAndDelete,
      findAndUpdate  
    };
  
  