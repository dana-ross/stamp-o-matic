(function() {

  var font_height_px = {
      'Capture It': 46,
      'Masterplan': 72,
      'D Day Stencil': 72
  };
  var stamp_text = 'Your Text';
  var stamp_font = 'Masterplan';
  var rectangle_padding_px = 10;
  var rectangle_line_width = 3;
  var canvas = document.getElementById('preview');
  var ctx = canvas.getContext('2d');
  var angle = -10.14;
  var background_image_contents = '';
  
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

    StamperPure.loadImage(document, 'texture.png', function(loader) {

      var text_width, temp_canvas, temp_ctx;

      temp_canvas = document.createElement('canvas');
      temp_canvas.width = '9999';
      temp_canvas.height = '9999';
      temp_ctx = temp_canvas.getContext('2d');

      temp_ctx.textAlign = 'top left';
      temp_ctx.font = 'normal normal ' + font_height_px + 'px' + ' "' + stamp_font + '"';
      text_width = temp_ctx.measureText(text);

      temp_canvas.width = text_width.width + (rectangle_padding_px * 2) + (rectangle_line_width * 2);
      temp_canvas.height = font_height_px + (rectangle_padding_px * 2) + (rectangle_line_width * 2);
      temp_ctx.font = 'normal normal ' + font_height_px + 'px' + ' "' + stamp_font + '"';
      temp_ctx.fillStyle = '#ca2541';

      temp_ctx.textBaseline = 'middle';
      temp_ctx.fillText(
        text,
        Math.round((rectangle_padding_px * 2) - (rectangle_line_width)) - 1,
        Math.round(font_height_px / 2 + rectangle_padding_px + rectangle_line_width)
      );
      
      StamperPure.drawRectangleBorder(temp_canvas, rectangle_line_width, rectangle_padding_px, loader);

      callback.apply(this, [temp_canvas]);

    });
  }

  function render_canvas(canvas, ctx, font_height_px, stamp_text) {
    
    StamperPure.clearCanvas(canvas);
    if(background_image_contents) {
        var image = new Image;
        image.src = background_image_contents;
        image.onload = function(e) {
            var scalingFactor = StamperPure.aspectRatioCorrection(true, image, canvas);
            ctx.drawImage(image, 0, 0, image.width * scalingFactor, image.height * scalingFactor);
            apply_stamp(ctx, font_height_px, stamp_text);
        };
    }
    else {
        apply_stamp(ctx, font_height_px, stamp_text);     
    }
    
  }
  
  var fontLoader = new FontLoader([stamp_font], {
    'complete': function(error) {
      canvas.addEventListener('draw', function() {
          render_canvas(canvas, ctx, font_height_px[stamp_font] * StamperPure.getStampScalingFactor(document), document.getElementById('stamp_text').value)
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
  
  document.getElementById('background_image').addEventListener('change', readSingleFile, false);
  
  var inputs = document.querySelectorAll( 'input[type=file]' );
    Array.prototype.forEach.call( inputs, function( input ) {
        var label	 = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener( 'change', function( e ) {
            var fileName = '';
            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
                fileName = e.target.value.split( '\\' ).pop();

            if( fileName )
                label.querySelector( 'span' ).innerHTML = fileName;
            else
                label.innerHTML = labelVal;
        });
    });
}());
