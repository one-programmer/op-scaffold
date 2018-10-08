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

let histories
export function getHistories () {
  if (fs.existsSync(path.join(__static, `newSheet/`))) {
    let historiesArry = fs.readdirSync(path.join(__static, `newSheet/`))
    histories = historiesArry.filter(item => /\.json$/.test(item))
  }
  // 按文件修改时间(降序)显示历史文件名称
  histories = histories.sort((obj1, obj2) => {
    let time1 = fs.statSync(path.join(__static, `newSheet/`, obj1)).mtime
    let time2 = fs.statSync(path.join(__static, `newSheet/`, obj2)).mtime
    return time2 - time1
  })
  return histories
}

export function deleteHistory (table, index) {
  fs.unlink(path.join(__static, `newSheet/`, `${table}`), err => {
    if (err) return console.log(err)
    histories.splice(index, 1)
  })
}

export function getTableData (filepath) {
  if (!path.isAbsolute(filepath)) {
    filepath = path.join(__static, `newSheet/`, `${filepath}`)
  }
  return fs.readFileSync(filepath, 'utf8')
}
