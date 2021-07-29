const util = require('../../util')

module.exports = async (args) => {
  await util.mongodb.write('users', [args])
  return
}