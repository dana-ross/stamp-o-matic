/**
 * Load an image into an <img> tag and call a callback when it's loaded
 * @param object document window.document
 * @param string image url
 * @param function callback
 * @return object image tag used to load the image
 */
exports.loadImage = function(document, image, callback) {
    var loader = document.createElement('img');

    loader.style.display = 'none';
    loader.height = 1;
    loader.width = 1;
    loader.onload = function() {
        callback.apply(this, [loader]);
    }
    loader.src = image;

    return loader;
};

/**
 * Clear a canvas by painting a white rectangle over it
 * @param canvas canvas
 * @return canvas
 */
exports.clearCanvas = function(canvas) {
    var ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
};

/**
 * Calculate the scaling factor that needs to be applied to an image in order to fit it in a canvas.
 * 
 * @param bool preferFullWidth Fit to width with possible "space" above & below. If false, fits with space on left & right.
 * @param object image <img> tag
 * @param object canvas <canvas> tag
 * @return float scaling factor to apply to the image in order to fit it in the given canvas 
 */
exports.aspectRatioCorrection = function(preferFullWidth, image, canvas) {

    var scalingFactor;

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var screenAspectRatio = canvasWidth / canvasHeight;

    var imageWidth = image.width;
    var imageHeight = image.height;
    var imageAspectRatio = imageWidth / imageHeight;

    if (preferFullWidth) {
        if (screenAspectRatio > imageAspectRatio) {
            scalingFactor = canvasWidth / imageWidth;
        } else {
            scalingFactor = canvasHeight / imageHeight;
        }
    } else {
        if (screenAspectRatio > imageAspectRatio) {
            scalingFactor = canvasHeight / imageHeight;
        } else {
            scalingFactor = canvasWidth / imageWidth;
        }
    }

    return scalingFactor;

}

/**
 * Get the selected scaling factor from the DOM or default to 1
 * @param object document window.document
 * @return integer
 */
exports.getStampScalingFactor = function(document) {
    return parseInt(document.querySelectorAll('[name=stamp_size]:checked') && document.querySelectorAll('[name=stamp_size]:checked')[0].value) || 1
}

/**
 * Draw the rectangular border
 * @param object canvas <canvas> element
 * @param integer lineWidth line width in px
 * @param integer padding box padding in px
 * @param object img <img> tag to use as a pattern
 * @return <canvas> object
 */
exports.drawRectangleBorder = function(canvas, lineWidth, padding, img) {
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = lineWidth;
    if (img) {
        ctx.strokeStyle = ctx.createPattern(img, 'repeat');
    }

    ctx.strokeRect(
        Math.round(padding / 2),
        Math.round(padding / 2),
        canvas.width - padding,
        canvas.height - padding
    );

    return canvas;
}
