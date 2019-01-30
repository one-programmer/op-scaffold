const fs = require('fs')
const path = require('path')
const vm = require('vm')
const ejs = require('ejs')

export default (sourceDir, dataConfig, fields, searchList) => {
  const sandbox = {
    sourceDir, dataConfig, fields, searchList, fs, path, ejs
  }
  const data = fs.readFileSync(path.join(sourceDir, '.op/doRender.js'))
  vm.runInNewContext(data, sandbox)
}
