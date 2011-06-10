MiroIt.Services = {

  googlereader : {
    probe : function(doc) {
      var chrome = doc.getElementById('chrome');
      if (chrome == null)
        return false;

      return true;
    },
    url : 'resource://miroit/googlereader.js'
  },

  probe : function(doc) {
    var services = [ this.googlereader ];

    for ( var i = 0; i < services.length; i++) {
      var service = services[i];
      if (service.probe(doc)) {
        var invokeService = doc.getElementById('invokeService');
        if (invokeService == null) {
          invokeService = doc.createElement('script');
          invokeService.id = 'invokeService';
          invokeService.setAttribute('type', 'text/javascript');
          invokeService.setAttribute('src', service.url);
          doc.body.appendChild(invokeService);
        }
        return true;
      }
    }

    return false;
  }

};
