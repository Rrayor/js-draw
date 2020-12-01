export const lerp = (v0, v1, t) => {
    return (1 - t) * v0 + t * v1
}

export const euclideanDistance = (dx, dy, dz) => dx * dx + dy * dy + dz * dz
export const manhattanDistance = (dx, dy, dz) => Math.abs(dx) + Math.abs(dy) + Math.abs(dz)