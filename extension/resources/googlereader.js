var MiroItBrowser = {};

MiroItBrowser.GoogleReader = {

  href : null,
  max : 0,

  parse : function(doc) {
    var chrome = doc.getElementById('chrome');

    // restrictions:

    // extensions unable to override element.insertBefore functions.
    // it have two scoopes for it. one scoope for extension object and
    // another
    // for browser object.
    // if you try to change it here it will no affect state of browser
    // object
    // (only in specified function, you still may change 'class' attribute
    // for
    // example)

    // broken.
    //
    // that = this;
    // chrome.addEventListener('DOMSubtreeModified', listener =
    // function(event)
    // {
    // chrome.removeEventListener('DOMSubtreeModified', listener, false);
    // that.overrideEntries(doc);
    // }, false);

    var that = this;
    chrome.addEventListener('DOMSubtreeModified', listener = function(event) {
      that.catchEntries(doc, event);
    }, false);

    var invokeCSS = doc.getElementById('invokeCSS');
    if (invokeCSS == null) {
      invokeCSS = doc.createElement('link');
      invokeCSS.id = 'invokeCSS';
      invokeCSS.setAttribute('rel', 'stylesheet');
      invokeCSS.setAttribute('type', 'text/css');
      invokeCSS.setAttribute('href', 'resource://miroit/googlereader.css');
      doc.head.appendChild(invokeCSS);
    }

  },

  // broken
  overrideEntries : function(doc) {
    var entries = doc.getElementById('entries');
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
    var element = event.originalTarget;

    if (element instanceof HTMLDivElement) {
      if (element.id == "entries")
        this.mark(doc);
    }
  },

  mark : function(doc) {
    var title = doc.getElementById('chrome-title');
    var entries = doc.getElementById('entries');

    var href = null;
    if (title.children.length > 0)
      href = title.children[0].href;
    else
      href = title.value;

    var current = this.max;

    if (this.href != href) {
      current = 0;
      this.href = href;
    }

    var max = entries.children.length - 1;

    for (; max > current; max--) {
      var entry = entries.children[max];
      if (entry.id == 'scroll-filler')
        break;
    }

    for (; current < max; current++) {
      var entry = entries.children[current];
      var card = entry.children[0];

      // here can be 'search-result', 'card card-0'
      if (card.className.indexOf('card card') != -1)
        this.addMiro(doc, card);
    }

  },

  addMiro : function(doc, card) {
    var icons = card.children[0].children[0].children[1];

    var miro = null;
    for ( var i = 0; i < icons.children.length; i++) {
      var icon = icons.children[i];
      if (icon.getAttribute('class') == 'miroit') {
        miro = icon;
        break;
      }
    }

    if (miro == null) {
      var title = card.children[0].children[0].children[0].children[1].children[0];

      var body = card.children[0].children[0].children[0].children[5];
      var audio = null;

      if (body.children[0].children.length > 1)
        audio = body.children[0].children[1];

      // 1) check if audio box preset
      if (audio != null) {
        for ( var i = 0; i < audio.children.length; i++) {
          if (audio.children[i].className == 'view-enclosure-parent') {
            var href = audio.children[i].children[0].href;
            // check for supported audio formats
            if (this.checkFormat(href)) {
              this.addMiroIcon(doc, icons, href);
              return; // exit
            }
          }
        }
      }

      // 2) check for native site support by miro
      if (this.checkSite(title.href)) {
        this.addMiroIcon(doc, icons, title.href);
        return; // exit
      }
    }
  },

  addMiroIcon : function(doc, icons, href) {
    miro = doc.createElement('div');
    miro.className = 'miroit';
    icons.appendChild(miro);

    that = this;
    miro.onclick = function() {
      that.invokeMiro(href);
    };
  },

  // return true if this url is native compatible to miro
  checkSite : function(url) {

    var href = [ 'youtube.com/watch' ];

    for ( var i = 0; i < href.length; i++) {
      if (url.indexOf(href[i]) != -1)
        return true;
    }

    return false;
  },

  // check file url if it native compatible to miro
  checkFormat : function(url) {
    url = url.toLowerCase();

    var href = [ '.jpg', '.png', '.gif', '.jpeg' ];

    for ( var i = 0; i < href.length; i++) {
      if (url.indexOf(href[i]) != -1)
        return false;
    }

    return true;
  },

  invokeMiro : function(uri) {
    var obj = document.createElement("object");
    obj.setAttribute("type", "application/miroit-run-plugin");
    document.body.appendChild(obj);
    obj.miro(uri);
    document.body.removeChild(obj);
    return;
  }

};

MiroItBrowser.GoogleReader.parse(document);