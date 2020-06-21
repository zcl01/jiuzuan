const storageKeys = [
  'User', //  缓存用户信息
  'DisplayColumnInfo' //  缓存审核列数据
]
const storageUtility = {
  setObj(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data))
  },
  getObj(key) {
    try {
      const data = JSON.parse(window.localStorage.getItem(key))
      return data
    } catch (e) {
      return null
    }
  },
  removeObj(key) {
    try {
      window.localStorage.removeItem(key)
    } catch (e) {
      return null
    }
  }
}
const localStorage = {}
for (let i = 0; i < storageKeys.length; i++) {
  const key = storageKeys[i]
  localStorage['set' + key] = (value) => {
    storageUtility.setObj(key, value)
  }
  localStorage['get' + key] = () => {
    return storageUtility.getObj(key)
  }
  localStorage['remove' + key] = () => {
    return storageUtility.removeObj(key)
  }
}
export default localStorage
