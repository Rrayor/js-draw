/*
    @author Benjamin Simon
    @license MIT
    @source Sources:
        https://github.com/zsoltc/worley-noise
        Javascript implementation (MIT)
        by zsoltc

        https://esimov.com/2012/05/worley-noise-cellular-texturing
        article and Javascript implementation (MIT)
        by Endre Simo
*/
import seedrandom from 'seedrandom'

import { euclideanDistance, manhattanDistance } from './mathematics'

export default class Worley {

    validateConfig(config) {
        return config || {}
    }
    validateDimension(dim) {
        return (dim === 2 || dim === 3) ? dim : 2
    }

    validateSeed(seed) {
        return seed || Date.now()
    }

    validateNumPoints(numPoints) {
        return (numPoints && !isNaN(numPoints)) ? numPoints : 10
    }

    validateCoordNumber(num) {
        return (num && !isNaN(num)) ? num : 0
    }

    constructor(config) {
        config = this.validateConfig(config)
        this.dim = this.validateDimension(config.dim)
        config.seed = this.validateSeed(config.seed)
        config.numPoints = this.validateNumPoints(config.numPoints)
        this.prng = seedrandom(config.seed)
        this.points = []

        for (let i = 0; i < config.numPoints; i++) {
            this.points.push({
                x: this.prng(),
                y: this.prng(),
                z: this.prng()
            })
        }
    }

    addPoint(x, y, z) {
        x = this.validateCoordNumber(x)
        y = this.validateCoordNumber(y)
        z = this.validateCoordNumber(z)
        this.points.push({ x, y, z })
    }

    getEuclideanDistance(x, y, z, k) {
        return Math.sqrt(this.calculateValue(x, y, z, k, euclideanDistance))
    }

    getManhattanDistance(x, y, z, k) {
        return Math.sqrt(this.calculateValue(x, y, z, k, manhattanDistance))
    }

    renderImage(resolution, config) {
        config = this.validateConfig(config)
        resolution = this.validateCoordNumber(resolution)
        const step = 1 / (resolution - 1)
        const img = []
        const callback = config.callback || ((e, m) => e(1))
        let x, y

        const e = k => Math.sqrt(this.calculateValue(x * step, y * step, (config.z || 0), k, euclideanDistance))

        const m = k => this.calculateValue(x * step, y * step, (config.z || 0), k, manhattanDistance)

        for (y = 0; y < resolution; y++) {
            for (x = 0; x < resolution; x++) {
                img[y * resolution + x] = callback(e, m)
            }
        }

        if (!config.normalize) return img

        let min = Number.MAX_VALUE
        let max = Number.MIN_VALUE

        img.forEach(v => {
            min = Math.min(min, v)
            max = Math.max(max, v)
        })

        let scale = 1 / (max - min)
        return img.map(v => (v - min) * scale)
    }

    calculateValue(x, y, z, k, distFn) {
        x = this.validateCoordNumber(x)
        y = this.validateCoordNumber(y)
        z = this.validateCoordNumber(z)

        let minDist
        this.points.forEach(p => { p.selected = false })
        const pointsLength = this.points.length

        for (let i = 0; i < k; i++) {
            let minIdx
            minDist = Number.MAX_VALUE

            for (let j = 0; j < pointsLength; j++) {
                const p = this.points[j]
                const dz = this.dim === 2 ? 0 : z - p.z
                const dist = distFn(x - p.x, y - p.y, dz)

                if (dist < minDist && !p.selected) {
                    minDist = dist
                    minIdx = j
                }
            }

            this.points[minIdx].selected = true
        }

        return minDist
    }
}