const util = require('../../util')

module.exports = async (username, uuid) => {
  let res = await util.mongodb.read('users', username ? {username} : {uuid})
  if (!res.length) throw new Error(`Cannot find the user`)
  return res[0]
}