const util = require('../../util')
const { ApolloError } = require('apollo-server-errors')

module.exports = async () => {
  let res = await util.mongodb.read("users", {})
  if (!res.length) throw new Error(`Cannot find the user`, `RESOURCE_NOT_FOUND`)
  let {username, fullname, uuid, bio, avatar, naggingCount} = res[0]
  return { username, fullname, uuid, bio, avatar, naggingCount}
}