const fs = require('fs')
const path = require('path')
const vm = require('vm')
const ejs = require('ejs')

export default (sourceDir, dataConfig, fields, searchList, projectConfig) => {
  console.log('projectConfig', projectConfig)
  const sandbox = {
    sourceDir, dataConfig, fields, searchList, projectConfig, fs, path, ejs, console
  }
  const data = fs.readFileSync(path.join(sourceDir, '.op/doRender.js'))
  vm.runInNewContext(data, sandbox)
}
