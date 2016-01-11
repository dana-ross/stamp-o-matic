window.StamperUtil = (function() {

  var module = {};
  
  module.load_image = function(image, callback) {
    var loader = document.createElement('img');
    loader.onload = function() {
      callback.apply(this, [loader]);
    }
    loader.src = image;
  }

  return module;

}());
