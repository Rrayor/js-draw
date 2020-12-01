import Worley from './noise/Worley'

const draw = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));
    const pixels = imageData.data;
    const noise = new Worley({ numPoints: 50 });
    const img = noise.renderImage(imageData.width, { normalize: true });

    for (let y = 0; y < imageData.height; ++y) {
        for (let x = 0; x < imageData.width; ++x) {
            let base = (y * imageData.width + x) * 4;
            pixels[base] = img[y * imageData.width + x] * 255;
            pixels[base + 1] = img[y * imageData.width + x] * 255;
            pixels[base + 2] = img[y * imageData.width + x] * 255;
            pixels[base + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

draw()