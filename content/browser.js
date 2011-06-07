MiroIt.Browser = {

  href : null,
  max : 0,

  init : function() {
    this._addEventListeners();
  },

  uninit : function() {
  },

  /**
   * Adds the event listeners.
   */
  _addEventListeners : function(miroit) {

    var that = this;
    gBrowser.addEventListener("DOMContentLoaded", function(event) {
      that.handlePageLoaded(event);
    }, true);
  },

  /**
   * Handles the DOMContentLoaded event.
   * 
   * @param aEvent
   *            the event object.
   */
  handlePageLoaded : function(event) {
    var doc = event.originalTarget;

    if (doc instanceof HTMLDocument) {
      this.parse(doc);
    }
  },

  parse : function(doc) {
    MiroIt.GoogleReader.parse(doc);
  }

};
