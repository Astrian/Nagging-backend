const util = require('../../util')

module.exports = async () => {
  let res = await util.mongodb.read("users", {})
  if (!res.length) throw new Error(`Cannot find the user`)
  let {username, fullname, uuid, bio} = res[0]
  return { username, fullname, uuid, bio}
}