
// * Generate random movie Id
export const randomMovie = (movieData) => {
  return movieData[Math.floor(Math.random() * movieData.length)]
}

export const shuffle = (array) => {
  let currentIndex = array.length
  let randomIndex
  console.log('ARRAY BEFORE', array)
  while (currentIndex !== 1) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    // console.log('randomIndex', randomIndex)
    currentIndex--
    // console.log('currentIndex', currentIndex)
    // console.log('ARRAY SHUFFLE', [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]])
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    // console.log('test', array)
  }
  // console.log('ARRAY AFTER', array)
  return array
}