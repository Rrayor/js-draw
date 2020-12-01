import seedrandom from 'seedrandom'
import { makeNoise2D } from "open-simplex-noise"

const imageSize = 10240

const canvas = document.getElementById("canvas");
const [imageWidth, imageHeight] = [imageSize, imageSize];
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(imageWidth, imageHeight);
const noise2D = makeNoise2D(Date.now());


// deep sea (22,29,84)
// sea (61,156,193)
// grass (86,122,44)
// sand (212,178,97)
// mountain (120,80,30)

for (let x = 0; x < imageWidth; x++) {
    if (genContinent) {
        const lengthValue = Math.abs((noise2D(x / 4, x / 4)) * 128) * 100
        continentLength = Math.max(0, (60000 - lengthValue)) * 2
        continentCurrentLength++
    } else {
        continentLength = 0
        continentCurrentLength = 0
    }

    for (let y = 0; y < imageHeight; y++) {
        const i = (x + y * imageWidth) * 4;
        const value = Math.abs((noise2D(x / 4, y / 4)) * 128) * 100
        const continent = (Math.max(0, (100 - (value * 1000))) * 2) > 199 && currentContinentCount < maxContinentCount
        let height = (value / 20) + Math.max(0, (10 - value)) * 4


        if (continent && continentLength <= 0) {
            continentLength = 1
        }

        if (continent ||
            (
                (continentLength > 0 && continentCurrentLength <= continentLength) &&
                (continentWidth > 0 && continentCurrentWidth <= continentWidth)
            )
        ) {
            genContinent = true
        } else {
            genContinent = false
        }

        if (genContinent && continentWidth <= 0) {
            continentWidth = Math.max(0, (60000 - value)) * 2
        }

        if (genContinent) {
            check = 'success'
            checkGenContinent = genContinent
            height = value + Math.max(0, (1200 - value)) * 8
            continentCurrentWidth++
            checkContinentWidth = continentCurrentWidth
            checkContinentLength = continentCurrentLength
        } else {
            continentWidth = 0
            continentCurrentWidth = 0
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

const generateHeightMap = (width, height, seed, scale, octaves, persistance, lacunarity, offset) => {
    if (!width || width <= 0) {
        width = 1
    }

    if (!height || height <= 0) {
        height = 1
    }

    if (!scale || scale <= 0) {
        scale = 0.0001
    }

    if (!offset) {
        offset = {}
    }

    if (!offset.x) {
        offset.x = 0
    }

    if (!offset.y) {
        offset.y = 0
    }

    if (!seed) {
        seed = Date.now()
    }

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    const imageData = ctx.createImageData(imageWidth, imageHeight)
    const noise2D = makeNoise2D(seed)
    const octaveOffsets = [];

    const prng = seedrandom(seed)

    for (let i = 0; i < octaves; i++) {
        octaveOffsets.push({
            x: prng() * 10000 + 20000 + offset.x,
            y: prng() * 10000 + 20000 + offset.y
        })
    }

    let maxNoiseHeight = Number.MIN_VALUE
    let minNoiseHeight = Number.MAX_VALUE

    const halfWidth = width / 2
    const halfHeight = height / 2

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = (x + y * imageWidth) * scale;
            let amplitude = 1
            let frequency = 1
            let noiseHeight = 0

            for (let i = 0; i < octaves; i++) {
                const sampleX = (x - halfWidth) / scale * frequency + octaveOffsets[i].x
                const sampleY = (y - halfHeight) / scale * frequency + octaveOffsets[i].y

                const noiseValue = noise2D(sampleX, sampleY) * 2 - 1
                noiseHeight = noiseValue + amplitude

                amplitude *= persistance
                frequency *= lacunarity
            }

            if (noiseHeight > maxNoiseHeight) {
                maxNoiseHeight = noiseHeight;
            } else if (noiseHeight < minNoiseHeight) {
                minNoiseHeight = noiseHeight;
            }

            imageData.data[cell]
        }

        if (height < 0.4) {
            imageData.data[cell] = 22
            imageData.data[cell + 1] = 29
            imageData.data[cell + 2] = 84
        } else if (height < 1) {
            imageData.data[cell] = 61
            imageData.data[cell + 1] = 156
            imageData.data[cell + 2] = 193
        } else if (height < 2200) {
            imageData.data[cell] = 212
            imageData.data[cell + 1] = 178
            imageData.data[cell + 2] = 97
        } else if (height < 9000) {
            imageData.data[cell] = 86
            imageData.data[cell + 1] = 122
            imageData.data[cell + 2] = 44
        } else {
            imageData.data[cell] = 120
            imageData.data[cell + 1] = 80
            imageData.data[cell + 2] = 30
        }

        imageData.data[cell + 3] = 255;
    }
}

/*
C# sample

using UnityEngine;
using System.Collections;

public static class Noise {

	public static float[,] GenerateNoiseMap(int mapWidth, int mapHeight, int seed, float scale, int octaves, float persistance, float lacunarity, Vector2 offset) {
		float[,] noiseMap = new float[mapWidth,mapHeight];

		System.Random prng = new System.Random (seed);
		Vector2[] octaveOffsets = new Vector2[octaves];
		for (int i = 0; i < octaves; i++) {
			float offsetX = prng.Next (-100000, 100000) + offset.x;
			float offsetY = prng.Next (-100000, 100000) + offset.y;
			octaveOffsets [i] = new Vector2 (offsetX, offsetY);
		}

		if (scale <= 0) {
			scale = 0.0001f;
		}

		float maxNoiseHeight = float.MinValue;
		float minNoiseHeight = float.MaxValue;

		float halfWidth = mapWidth / 2f;
		float halfHeight = mapHeight / 2f;


		for (int y = 0; y < mapHeight; y++) {
			for (int x = 0; x < mapWidth; x++) {
		
				float amplitude = 1;
				float frequency = 1;
				float noiseHeight = 0;

				for (int i = 0; i < octaves; i++) {
					float sampleX = (x-halfWidth) / scale * frequency + octaveOffsets[i].x;
					float sampleY = (y-halfHeight) / scale * frequency + octaveOffsets[i].y;

					float perlinValue = Mathf.PerlinNoise (sampleX, sampleY) * 2 - 1;
					noiseHeight += perlinValue * amplitude;

					amplitude *= persistance;
					frequency *= lacunarity;
				}

				if (noiseHeight > maxNoiseHeight) {
					maxNoiseHeight = noiseHeight;
				} else if (noiseHeight < minNoiseHeight) {
					minNoiseHeight = noiseHeight;
				}
				noiseMap [x, y] = noiseHeight;
			}
		}

		for (int y = 0; y < mapHeight; y++) {
			for (int x = 0; x < mapWidth; x++) {
				noiseMap [x, y] = Mathf.InverseLerp (minNoiseHeight, maxNoiseHeight, noiseMap [x, y]);
			}
		}

		return noiseMap;
	}

}
*/


console.log(check, checkGenContinent)

console.log(currentContinentCount, checkContinentWidth, checkContinentLength)

ctx.putImageData(imageData, 0, 0);