(function() {

  var font_height_px = 72;
  var stamp_text = 'test';
  var rectangle_padding_px = 10;
  var rectangle_line_width = 3;
  var canvas = document.getElementById('preview');
  var ctx = canvas.getContext('2d');
  var angle = -10.14;

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

  var fontLoader = new FontLoader(['Masterplan'], {
    'complete': function(error) {
      canvas.addEventListener('draw', function() {
        StamperUtil.clear_canvas(canvas);
        StamperUtil.load_image('glasses.jpg', function(loader) {
          // ctx.drawImage(loader, 0, 0, canvas.width, canvas.height);
          apply_stamp(ctx, font_height_px, stamp_text);
        });
      });
      canvas.dispatchEvent(new Event('draw'));
    }
  }, 3000);
  fontLoader.loadFonts();

  window.addEventListener('resize', function() {
    // Redraw the canvas on the next frame
    requestAnimationFrame(function() {
      canvas.dispatchEvent(new Event('draw'));
    });
  });

}());
