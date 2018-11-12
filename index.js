import './src/styles/index.styl'

import init from './src/js/init'
import getResults from './src/js/getResults'

const initialize = () => {
  const modules = [
    getResults,
    init
  ]

  modules.forEach(module => { setTimeout(module, 0) })
}

window.addEventListener('DOMContentLoaded', initialize)
