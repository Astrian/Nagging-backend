const util = require('../../util')

module.exports = async (username, uuid) => {
  let res = await util.mongodb.read("users", {})
  if (!res.length) throw new Error(`Cannot find the user`)
  return res[0]
}