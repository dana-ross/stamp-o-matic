window.StamperUtil = (function() {

  var module = {};

  module.load_image = function(image, callback) {
    var loader = document.createElement('img');
    loader.onload = function() {
      callback.apply(this, [loader]);
    }
    loader.src = image;
  }

  module.clear_canvas = function(canvas) {
    var ctx = canvas.getContext('2d');
    // Clear the canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  return module;

}());
