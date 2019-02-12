const path = require('path')
const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(path.join(__static, 'database.json'))
const db = low(adapter)
db._.mixin(lodashId)
db.defaults({ projects: [], histories: [] }).write()

export default db
