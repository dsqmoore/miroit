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
    that = this;

    gBrowser.addEventListener("DOMContentLoaded", function(aEvent) {
      that._handlePageLoaded(aEvent);
    }, true);
  },

  /**
   * Handles the DOMContentLoaded event.
   * 
   * @param aEvent
   *            the event object.
   */
  _handlePageLoaded : function(event) {
    doc = event.originalTarget;

    if (doc instanceof HTMLDocument) {
      this.parse(doc);
    }
  },

  parse : function(doc) {
    MiroIt.GoogleReader.parse(doc);
  }

};
