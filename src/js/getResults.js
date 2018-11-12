export default () => {
  const resultList = document.getElementById('results')
  let results = JSON.parse(localStorage.getItem('snakeScore')) || []

  if (!results.length) return

  results = results.map(item => Object.values(item)[0])
  results = results.filter((item, index) => (item > 0) && (results.indexOf(item) == index))
  results = results.sort((a, b) => a - b).reverse().slice(0, 5)

  results.forEach((item, index) => {
    const element = document.createElement('li')
    element.innerHTML = `${index + 1}. ${item}`
    element.className = 'results__item'

    resultList.appendChild(element)
  })
}
