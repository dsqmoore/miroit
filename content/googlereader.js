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

    MiroIt.Console.debug(chrome);

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
      invokeMiro = doc.createElement('script');
      invokeMiro.id = 'invokeMiro';
      invokeMiro.setAttribute('type', 'text/javascript');
      invokeMiro.innerHTML = 'function start(uri){ try{ var obj = document.createElement("object"); obj.setAttribute("type", "application/x-vnd-aplix-foo"); document.body.appendChild(obj); obj.miro(uri); }catch(e){ alert(e); } return; }';
      doc.body.appendChild(invokeMiro);
    }

    MiroIt.Console.debug(invokeMiro);

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
    element = event.originalTarget;

    if (element instanceof HTMLDivElement) {
      MiroIt.Console.debug("changed " + element.id);
      if (element.id == "entries")
        this.mark(doc);
    }
  },

  mark : function(doc) {
    var title = doc.getElementById('chrome-title');
    var entries = doc.getElementById('entries');

    MiroIt.Console.debug("mark " + title + " " + entries);

    var href = null;
    if (title.children.length > 0)
      href = title.children[0].href;
    else
      href = title.value;

    var max = this.max;

    if (this.href != href) {
      max = 0;
    }

    var last = entries.children.length - 1;

    for (; last > max; last--) {
      var entry = entries.children[last];
      if (entry.id == 'scroll-filler')
        break;
    }

    MiroIt.Console.debug("mark " + title + " " + entries + " " + max + "/" + last);

    for ( var i = max; i < last; i++) {
      var entry = entries.children[i];
      try {
        this.addMiro(doc, entry);
      } catch (e) {
        alert(e);
      }
    }

    max = i;

    this.href = href;
    this.max = max;

  },

  addMiro : function(doc, entry) {
    MiroIt.Console.debug("addMiro " + entry);

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

      var body = entry.children[0].children[0].children[0].children[0].children[5];
      var audio = null;

      if (body.children[0].children.length > 1)
        audio = body.children[0].children[1];

      if (audio != null) {
        for ( var i = 0; i < audio.children.length; i++) {
          MiroIt.Console.debug("AudioSearch " + audio.children[i].className + " " + i);
          if (audio.children[i].className == 'view-enclosure-parent')
            break;
        }
        MiroIt.Console.debug("AudioSearch " + audio + " " + i);
        this.addMiroIcon(icons, audio.children[i].children[0].href);
      }

      if (this.checkSite(title.href)) {
        this.addMiroIcon(icons, title.href);
      }
    }
  },

  addMiroIcon : function(icons, href) {
    miro = doc.createElement('div');
    miro.className = 'miro';
    miro.style.background = 'url(resource://miroit/icon16.png)';
    miro.style.height = '32px';
    miro.style.width = '16px';
    miro.style.cursor = 'pointer';
    icons.appendChild(miro);

    var run = 'start("' + href + '")';
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
