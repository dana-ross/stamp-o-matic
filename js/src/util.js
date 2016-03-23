window.StamperUtil = (function() {

  var module = {};

  /**
   * Load an image into an <img> tag and call a callback when it's loaded
   * @param object document window.document
   * @param string image
   * @param function callback
   */
  module.load_image = function(document, image, callback) {
    var loader = document.createElement('img');
    loader.style.display = 'none';
    loader.height = 1;
    loader.width = 1;
    loader.onload = function() {
      callback.apply(this, [loader]);
    }
    loader.src = image;
  };

  /**
   * Clear a canvas by painting a white rectangle over it
   * @param canvas canvas
   */
  module.clear_canvas = function(canvas) {
    var ctx = canvas.getContext('2d');
    // Clear the canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  return module;

}());
