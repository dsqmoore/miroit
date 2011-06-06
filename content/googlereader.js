MiroIt.GoogleReader = {

  href : null,
  max : 0,

  init : function() {
  },

  uninit : function() {
  },

  parse : function(doc) {
    chrome = doc.getElementById('chrome');
    if (chrome == null)
      return false;

    // restrictions:

    // extensions unable to override element.insertBefore functions.
    // it have two scoopes for it. one scoope for extension object and another
    // for browser object.
    // if you try to change it here it will no affect state of browser object
    // (only in specified function, you still may change 'class' attribute for
    // example)

    // broken.
    //
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

    var invokeMiro = doc.getElementById('invokeMiro');
    if (invokeMiro == null) {
      var script = doc.createElement('script');
      script.id = 'invokeMiro';
      script.setAttribute('type', 'text/javascript');
      script.innerHTML = 'function start(uri){ try{ var obj = document.createElement("object"); obj.setAttribute("type", "application/x-vnd-aplix-foo"); document.body.appendChild(obj); obj.miro(uri); }catch(e){ alert(e); } return; }';
      doc.body.appendChild(script);
    }

    return true;
  },

  // broken
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
      var title = entry.children[0].children[0].children[0].children[0].children[1].children[0];

      if (!this.checkSite(title.href))
        return;

      miro = doc.createElement('div');
      miro.className = 'miro';
      miro.style.background = 'url(resource://miroit/icon16.png)';
      miro.style.height = '32px';
      miro.style.width = '16px';
      miro.style.cursor = 'pointer';
      icons.appendChild(miro);

      var run = 'start("' + title.href + '")';
      miro.setAttribute('onclick', run);

      // restrictions

      // broken:
      // miro.click = fucntion() {};
      // extension unable to overdefine object.click function, it will throw
      // NS_ERROR_NOT_AVAILABLE)

      // broken:
      // miro.addEventListener('click', function, false);
      // inbound extension function unable to create <object> and add it to
      // body. it will
      // appear as empty element "".
    }
  },

  // broken
  clickMiro : function(doc, href) {
    var obj = document.createElement('object');
    obj.setAttribute('type', 'application/x-vnd-aplix-foo');
    document.body.appendChild(obj);

    obj.miro(href);

    document.body.removeChild(obj);
  },

  checkSite : function(url) {

    href = [ 'youtube.com/watch' ];

    for ( var i = 0; i < href.length; i++) {
      if (url.indexOf(href[i]) != -1)
        return true;
    }

    return false;
  }

};
