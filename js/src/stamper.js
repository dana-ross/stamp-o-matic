(function() {

  var font_height_px = 72;
  var stamp_text = 'test';
  var rectangle_padding_px = 10;
  var rectangle_line_width = 3;
  var canvas = document.getElementById('preview');
  var ctx = canvas.getContext('2d');
  var angle = -10.14;
  var background_image_contents = '';
  var single_transparent_pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  function apply_stamp(ctx, font_height_px, text) {

    draw_stamp(text, font_height_px, function(temp_canvas) {

      ctx.save();

      ctx.translate(
        Math.round(canvas.width / 2),
        Math.round(canvas.height / 2)
      )
      ctx.rotate((angle < 0 ? 360 - Math.abs(angle) : angle) * 0.017);

      ctx.drawImage(temp_canvas, Math.round(temp_canvas.width / -2), Math.round(temp_canvas.height / -2));
      ctx.restore();

    });

  }

  function draw_stamp(text, font_height_px, callback) {

    StamperUtil.load_image('texture.png', function(loader) {

      var text_width, temp_canvas, temp_ctx;

      temp_canvas = document.createElement('canvas');
      temp_canvas.width = '9999';
      temp_canvas.height = '9999';
      temp_ctx = temp_canvas.getContext('2d');

      temp_ctx.textAlign = 'top left';
      temp_ctx.font = 'normal normal ' + font_height_px + 'px' + ' ' + 'Masterplan';
      text_width = temp_ctx.measureText(text);

      temp_canvas.width = text_width.width + (rectangle_padding_px * 2) + (rectangle_line_width * 2);
      temp_canvas.height = font_height_px + (rectangle_padding_px * 2) + (rectangle_line_width * 2);
      temp_ctx.font = 'normal normal ' + font_height_px + 'px' + ' ' + 'Masterplan';
      temp_ctx.fillStyle = '#ca2541';

      temp_ctx.textBaseline = 'middle';
      temp_ctx.fillText(
        text,
        Math.round((rectangle_padding_px * 2) - (rectangle_line_width)) - 1,
        Math.round(font_height_px / 2 + rectangle_padding_px + rectangle_line_width)
      );

      // Draw the rectangular border
      temp_ctx.lineWidth = rectangle_line_width;
      temp_ctx.strokeStyle = temp_ctx.createPattern(loader, 'repeat');

      temp_ctx.strokeRect(
        Math.round(rectangle_padding_px / 2),
        Math.round(rectangle_padding_px / 2),
        temp_canvas.width - rectangle_padding_px,
        temp_canvas.height - rectangle_padding_px
      );

      callback.apply(this, [temp_canvas]);

    });
  }

  function render_canvas(canvas, ctx, font_height_px, stamp_text) {
    
    function aspectRatioCorrection(fillScreen, image, canvas) {
        var scalingFactor;

        var screenWidth = canvas.width;
        var screenHeight = canvas.height;
        var screenAspectRatio = screenWidth / screenHeight;
        var imageWidth = image.width;
        var imageHeight = image.height;
        var imageAspectRatio = imageWidth / imageHeight;

        if (fillScreen) {
            if (screenAspectRatio > imageAspectRatio) {
                scalingFactor = screenWidth / imageWidth;
            } else {
                scalingFactor = screenHeight / imageHeight;
            }
        } else {
            if (screenAspectRatio > imageAspectRatio) {
                scalingFactor =  screenHeight / imageHeight;
            } else {
                scalingFactor = screenWidth / imageWidth;
            }
        }

        return scalingFactor;
    }
    
    StamperUtil.clear_canvas(canvas);
    var image = new Image;
    image.onload = function(e) {
        var scalingFactor = aspectRatioCorrection(true, image, canvas);
        ctx.drawImage(image, 0, 0, image.width * scalingFactor, image.height * scalingFactor);
        apply_stamp(ctx, font_height_px, stamp_text);
    };
    image.src = background_image_contents ? background_image_contents : single_transparent_pixel;
  }
  
  var fontLoader = new FontLoader(['Masterplan'], {
    'complete': function(error) {
      canvas.addEventListener('draw', function() {
        render_canvas(canvas, ctx, font_height_px, document.getElementById('stamp_text').value)
      });
      canvas.dispatchEvent(new Event('draw'));
    }
  }, 3000);
  fontLoader.loadFonts();
  
  function readSingleFile(e) {
      var file = e.target.files[0];
      if (!file) {
          return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
          background_image_contents = e.target.result;
          canvas.dispatchEvent(new Event('draw'));
      };
      reader.readAsDataURL(file);
  }

  window.addEventListener('resize', function() {
    // Redraw the canvas on the next frame
    requestAnimationFrame(function() {
      canvas.dispatchEvent(new Event('draw'));
    });
  });
  
  document.getElementById('stamp_text').addEventListener('keyup', function(e) {
      canvas.dispatchEvent(new Event('draw'));
  });
  
  document.getElementById('background_image').addEventListener('change', readSingleFile, false);

  document.getElementById('download_button').addEventListener('click', function() {
     download(canvas.toDataURL('image/png'), 'stamp.png', 'image/png'); 
  });
  
}());