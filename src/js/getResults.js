export default () => {
  const resultList = document.getElementById('results')
  const resultItems = [ ...document.querySelectorAll('.results__item') ]
  let results = JSON.parse(localStorage.getItem('snakeScore')) || []

  if (!results.length) return

  results = results.map(item => Object.values(item)[0])
  results = results.filter((item, index) => (item > 0) && (results.indexOf(item) == index))
  results = results.sort((a, b) => a - b).reverse().slice(0, 5)

  if (resultItems.length) {
    resultItems.forEach(item => item.parentElement.removeChild(item))
  }

  results.forEach((item, index) => {
    const element = document.createElement('li')
    element.innerHTML = `${index + 1}. ${item}`
    element.className = 'results__item'

    resultList.appendChild(element)
  })
}
