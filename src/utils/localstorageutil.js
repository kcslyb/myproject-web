const availableLocalStorage = () => {
  return !!window.localStorage;
};
const addOrEditLocalStorage = (key, value) => {
  if (availableLocalStorage()) {
    let storage = window.localStorage;
    storage.setItem(key, JSON.stringify(value));
  }
};
const getLocalStorage = (key) => {
  if (availableLocalStorage()) {
    let storage = window.localStorage;
    return JSON.parse(storage.getItem(key));
  }
};
const removeLocalStorage = (key) => {
  if (availableLocalStorage()) {
    let storage = window.localStorage;
    storage.removeItem(key);
  }
};
const removeLocalStorageAll = () => {
  if (availableLocalStorage()) {
    let storage = window.localStorage;
    storage.clear();
  }
};
export {
  getLocalStorage,
  addOrEditLocalStorage,
  removeLocalStorage,
  removeLocalStorageAll
};
