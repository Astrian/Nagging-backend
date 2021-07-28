const util = require('../../util')

module.exports = async () => {
  let res = util.mongodb.read('users', {})
  return res
}