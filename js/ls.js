const saveToLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}
const getFromLS = (key) => {
  return JSON.parse(localStorage.get(key));
}