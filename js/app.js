import generatorForm from './ui/components/generatorForm'

const generatorFormElement = document.getElementById('generator_form')
const setupGeneratorForm = () => {
    generatorForm.initializeState()
    generatorFormElement.onsubmit = generatorForm.onSubmit
}

setupGeneratorForm()

