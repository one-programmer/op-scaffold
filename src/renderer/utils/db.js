const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(path.join(__static, 'database.json'))
const db = low(adapter)
db.defaults({ projects: [], histories: [] }).write()

export default db
