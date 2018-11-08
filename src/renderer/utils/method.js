export default (Vue) => {
  Vue.prototype.$op = {
    'changeCamelCase': (key) => {
      if (key.indexOf('_') > -1) {
        key = key.replace(/_(\w)/g, function (all, letter) {
          return letter.toUpperCase()
        })
      } else {
        key = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      }
      return key
    }
  }
}
