const fs = require('fs')
const path = require('path')

export default (dataConfig, dataList) => {
  let data = JSON.stringify({dataConfig, dataList})
  let name = dataConfig.name
  let dirName = path.join(__static, `newSheet/`)
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName)
  }
  fs.writeFileSync(path.join(dirName, `${name}.json`), data)
}
