var canvas = document.getElementById('preview');
var stamp_size_inputs = document.querySelectorAll('[name=stamp_size]');

window.addEventListener('resize', function() {
    // Redraw the canvas on the next frame
    requestAnimationFrame(function() {
        canvas.dispatchEvent(new Event('draw'));
    });
});

document.getElementById('stamp_text').addEventListener('keyup', function(e) {
    canvas.dispatchEvent(new Event('draw'));
});

for (var input = stamp_size_inputs[0], i = 0; i < stamp_size_inputs.length; i += 1, input = stamp_size_inputs[i]) {
    input.addEventListener('change', function(e) {
        canvas.dispatchEvent(new Event('draw'));
    });
};

document.getElementById('download_button').addEventListener('click', function() {
    download(canvas.toDataURL('image/png'), 'stamp.png', 'image/png');
});
