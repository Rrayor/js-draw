import { generateMap } from '../../noise/noiseController'

const state = {
    formData: {
        width: 1024,
        height: 1024,
        scale: 100,
        octaves: 5,
        persistence: 0.001,
        lacunarity: 2,
        offsetx: 0,
        offsety: 0,
        seed: Date.now(),
        noisetype: 'IMPROVED_PERLIN',
        displaytype: 'MONOCHROME'
    }
}

const setFormData = data => {
    state.formData = data
    setInputValues(state.formData)
}

const setInputValues = (dataset) => {
    Object.keys(dataset).forEach(name => {
        document.querySelector(`[name="${name}"]`).value = dataset[name]
    })
}

const onChange = e => { setFormData({ ...state.formData, [e.target.name]: e.target.value }) }

const initializeState = () => {
    setInputValues(state.formData)
    Object.keys(state.formData).forEach(name => {
        document.querySelector(`[name="${name}"]`).onchange = onChange
    })
}

const onSubmit = e => {
    e.preventDefault()
    const { formData } = state
    const seed = (formData.seed && formData.seed !== '') ? formData.seed : Date.now()
    setFormData({ ...formData, seed })
    const t0 = performance.now()
    generateMap(formData.noisetype, formData.displaytype, formData.width, formData.height, formData.seed, formData.scale, formData.octaves, formData.persistence, formData.lacunarity, { x: formData.offsetx, y: formData.offsety })
    const t1 = performance.now()
    console.log((t1 - t0) + 'ms')
    return false
}

export default {
    onChange,
    onSubmit,
    initializeState
}