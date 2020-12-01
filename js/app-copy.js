import { makeNoise2D } from "open-simplex-noise";

const imageSize = 10240

const canvas = document.getElementById("canvas");
const [width, height] = [imageSize, imageSize];
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(width, height);
const noise2D = makeNoise2D(Date.now());

const continentMaxWidth = 64
const continentMaxHeight = 128
const maxContinentCount = 3

let currentContinentCount = 0

let maxHeight = 0;
let minHeight = 10000;


// deep sea (22,29,84)
// sea (61,156,193)
// grass (86,122,44)
// sand (212,178,97)
// mountain (120,80,30)

let genContinent = false
let continentCurrentWidth = 0
let continentCurrentHeight = 0

for (let x = 0; x < width; x++) {
    if (genContinent) {
        continentCurrentWidth++
    }

    if (
        (continentCurrentWidth >= continentMaxWidth) &&
        (continentCurrentHeight >= continentMaxHeight)
    ) {
        genContinent = false
    }

    for (let y = 0; y < height; y++) {
        const i = (x + y * width) * 4;
        const value = Math.abs((noise2D(x / 4, y / 4)) * 128) * 100
        const continent = (Math.max(0, (100 - (value * 1000))) * 2) > 199 && currentContinentCount < maxContinentCount
        let height = (value / 20) + Math.max(0, (10 - value)) * 4
        //let height = value + Math.max(0, (10 - value)) * 4

        if (continent) {
            genContinent = true
        }

        if (genContinent) {
            height = value + Math.max(0, (1200 - value)) * 8
            continentCurrentHeight++
        }

        if (continent) currentContinentCount++

        if (height < 16) {
            imageData.data[i] = 22
            imageData.data[i + 1] = 29
            imageData.data[i + 2] = 84
        } else if (height < 2000) {
            imageData.data[i] = 61
            imageData.data[i + 1] = 156
            imageData.data[i + 2] = 193
        } else if (height < 2200) {
            imageData.data[i] = 212
            imageData.data[i + 1] = 178
            imageData.data[i + 2] = 97
        } else if (height < 9000) {
            imageData.data[i] = 86
            imageData.data[i + 1] = 122
            imageData.data[i + 2] = 44
        } else {
            imageData.data[i] = 120
            imageData.data[i + 1] = 80
            imageData.data[i + 2] = 30
        }
        imageData.data[i + 3] = 255;
    }
}

ctx.putImageData(imageData, 0, 0);