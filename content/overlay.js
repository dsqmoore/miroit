var MiroIt = {

  href : null,
  max : 0,

  init : function() {
    console.log("MiroIt: init");
    this._addEventListeners();
  },

  uninit : function() {
    console.log("MiroIt: uninit");
  },

  /**
   * Adds the event listeners.
   */
  _addEventListeners : function() {
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
    console.log("MiroIt: _handlePageLoad");

    doc = event.originalTarget;

    if (doc instanceof HTMLDocument) {
      this.parse(doc);
    }
  },

  parse : function(doc) {
    chrome = doc.getElementById('chrome');
    if (chrome == null)
      return;

    // that = this;
    // chrome.addEventListener('DOMSubtreeModified', listener = function(event)
    // {
    // chrome.removeEventListener('DOMSubtreeModified', listener, false);
    // that.overrideEntries(doc);
    // }, false);

    that = this;
    chrome.addEventListener('DOMSubtreeModified', listener = function(event) {
      that.catchEntries(doc, event);
    }, false);
  },

  overrideEntries : function(doc) {
    entries = doc.getElementById('entries');
    if (entries == null)
      return;

    alert(entries.insertBefore);
    entries._insertBefore = entries.insertBefore;
    entries.insertBefore = function(e1, e2) {
      alert('catch');
      entries._insertBefore(e1, e2);
    };
  },

  catchEntries : function(doc, event) {
    entrys = event.originalTarget;

    if (entrys instanceof HTMLDivElement) {
      if (entrys.getAttribute('class') == "single-source cards")
        this.mark(doc);
    }
  },

  mark : function(doc) {
    var title = doc.getElementById('chrome-title');
    var entries = doc.getElementById('entries');

    var href = title.children[0].href;
    var max = this.max;

    if (this.href != href) {
      max = 0;
    }

    var last = entries.children.length - 1;
    for ( var i = max; i < last; i++) {
      var entry = entries.children[i];
      this.addMiro(doc, entry);
    }

    max = i;

    this.href = href;
    this.max = max;

  },

  addMiro : function(doc, entry) {

    var start = doc.getElementById('start');
    if (start == null) {
      var script = doc.createElement('script');
      script.id = 'start';
      script.setAttribute('type', 'text/javascript');
      script.innerHTML = 'function start(uri){ try{ var obj = document.createElement("object"); obj.setAttribute("type", "application/x-vnd-aplix-foo"); document.body.appendChild(obj); obj.miro(uri); }catch(e){ alert(e); } return; }';
      doc.body.appendChild(script);
    }

    var icons = entry.children[0].children[0].children[0].children[1];

    var miro = null;
    for ( var i = 0; i < icons.children.length; i++) {
      var icon = icons.children[i];
      if (icon.getAttribute('class') == 'miro') {
        miro = icon;
        break;
      }
    }

    if (miro == null) {
      miro = doc.createElement('div');
      miro.className = 'miro';
      miro.style.background = 'url(chrome://miroit/html/icon16.png)';
      miro.style.height = '15px';
      miro.style.width = '15px';
      miro.style.cursor = 'pointer';
      icons.appendChild(miro);

      var title = entry.children[0].children[0].children[0].children[0].children[1].children[0];
      var run = 'start("' + title.href + '")';
      miro.setAttribute('onclick', run);

      // broken:
      // miro.click = fucntion() {};

      // broken:
      // miro.addEventListener('click', function);
    }
  },

  clickMiro : function(doc, href) {
    var obj = document.createElement('object');
    obj.setAttribute('type', 'application/x-vnd-aplix-foo');
    document.body.appendChild(obj);

    obj.miro(href);
  }

};

console.log("MiroIt: main");
window.addEventListener("load", function() {
  MiroIt.init();
}, false);

window.addEventListener("unload", function() {
  MiroIt.uninit();
}, false);
