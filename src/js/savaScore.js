export default score => {
  const key = Date.now()
  const items = JSON.parse(localStorage.getItem('snakeScore')) || []
  
  items.push({ [key]: score })
  localStorage.setItem('snakeScore', JSON.stringify(items))
}
