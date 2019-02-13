const fs = require('fs')

export function getDataFromFilePath (filePath) {
  const data = fs.readFileSync(filePath)
  return JSON.parse(data)
}
