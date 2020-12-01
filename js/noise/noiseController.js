import seedrandom from 'seedrandom'
import Perlin from '../noise/Perlin.js'
import { makeNoise2D } from 'open-simplex-noise'

import { noiseTypes, displayTypes } from './types'

import { terrainTypes } from './terrainTypes'

const validateNoiseType = noiseType => noiseType && noiseTypes[noiseType] || noiseTypes.OPEN_SIMPLEX
const validateDisplayType = displayType => displayType && displayTypes[displayType] || displayTypes.MONOCHROME
const validateWidthHeight = num => (!num || num <= 0) ? 1 : num
const validateScale = scale => (!scale || scale <= 0) ? 0.001 : scale

const validateOffset = offset => {
    offset = offset || {}
    offset.x = offset.x || 0
    offset.y = offset.y || 0

    return offset
}

const validateSeed = seed => seed || Date.now()

const sortTerrainTypes = () => {
    return terrainTypes.sort((a, b) => a.maxHeight - b.maxHeight)
}

const getTerrainTypeFromNoiseHeight = (noiseHeight) => {
    const terrainTypesArray = sortTerrainTypes()
    const terrainTypesLength = terrainTypesArray.length

    let terrainType = terrainTypesArray[0]

    for (let i = terrainTypesLength - 1; i >= 0; i--) {
        if (
            noiseHeight < terrainTypesArray[i].maxHeight &&
            (!terrainTypes[i - 1] || noiseHeight >= terrainTypesArray[i - 1].maxHeight)
        ) {
            terrainType = terrainTypesArray[i]
        }
    }

    return terrainType
}

const generateHeightMap = (noiseType, width, height, seed, scale, octaves, persistance, lacunarity, offset) => {
    noiseType = validateNoiseType(noiseType)
    width = validateWidthHeight(width)
    height = validateWidthHeight(height)
    scale = validateScale(scale)
    offset = validateOffset(offset)
    seed = validateSeed(seed)

    scale = width / 100 * scale

    const heightMap = []
    const perlin = new Perlin()
    const octaveOffsets = [];

    const noise2D = makeNoise2D(seed)

    const prng = seedrandom(seed)

    for (let i = 0; i < octaves; i++) {
        octaveOffsets.push({
            x: (prng() * 10000) + 20000 + offset.x,
            y: (prng() * 10000) + 20000 + offset.y
        })
    }

    let maxNoiseHeight = Number.MIN_VALUE
    let minNoiseHeight = Number.MAX_VALUE

    const halfWidth = width / 2
    const halfHeight = height / 2

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let amplitude = 1
            let frequency = 1
            let noiseHeight = 0

            for (let i = 0; i < octaves; i++) {
                const sampleX = (x - halfWidth) / scale * frequency + octaveOffsets[i].x
                const sampleY = (y - halfHeight) / scale * frequency + octaveOffsets[i].y

                let noiseValue
                switch (noiseType) {
                    case noiseTypes.IMPROVED_PERLIN:
                        noiseValue = perlin.perlin(sampleX, sampleY, 1) * 2 - 1
                        break;
                    case noiseTypes.OPEN_SIMPLEX:
                        noiseValue = noise2D(sampleX, sampleY) * 2 - 1
                        break;
                    default:
                        noiseValue = 0; //Never happens
                        break;
                }
                noiseHeight = noiseValue + amplitude

                amplitude *= persistance
                frequency *= lacunarity
            }

            if (noiseHeight > maxNoiseHeight) {
                maxNoiseHeight = noiseHeight;
            } else if (noiseHeight < minNoiseHeight) {
                minNoiseHeight = noiseHeight;
            }

            heightMap.push(noiseHeight)
        }
    }

    console.log(minNoiseHeight)
    console.log(maxNoiseHeight)

    return heightMap;
}

const generateMapFromHeightMap = (ctx, displayType, width, height, heightMap) => {
    displayType = validateDisplayType(displayType)
    const imageData = ctx.createImageData(width, height)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = (y * width + x) * 4;
            switch (displayType) {
                case displayTypes.MONOCHROME:
                    imageData.data[cell] = 0
                    imageData.data[cell + 1] = 0
                    imageData.data[cell + 2] = 0

                    imageData.data[cell + 3] = 255 * heightMap[cell]
                    break
                case displayTypes.TERRAIN:
                    const terrainType = getTerrainTypeFromNoiseHeight(heightMap[cell])
                    imageData.data[cell] = terrainType.color.r
                    imageData.data[cell + 1] = terrainType.color.g
                    imageData.data[cell + 2] = terrainType.color.b

                    imageData.data[cell + 3] = 255
                    break;
                default:
                    imageData.data[cell] = 0
                    imageData.data[cell + 1] = 0
                    imageData.data[cell + 2] = 0

                    imageData.data[cell + 3] = 0
                    break
            }
        }
    }

    return imageData
}

const generateMap = (noiseType, displayType, width, height, seed, scale, octaves, persistence, lacunarity, offset) => {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const heightMap = generateHeightMap(noiseType, width, height, seed, scale, octaves, persistence, lacunarity, offset)
    const imageData = generateMapFromHeightMap(ctx, displayType, width, height, heightMap)

    ctx.putImageData(imageData, 0, 0);
}

export {
    generateMap
}