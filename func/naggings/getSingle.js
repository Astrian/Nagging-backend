const util = require("../../util")
const {ApolloError} = require('apollo-server-errors')

module.exports = async (uuid) => {
  console.log(uuid)
  let nagging = await util.mongodb.read('naggings', { uuid })
  if (!nagging.length) throw new ApolloError('Cannot find the nagging with this uuid.', `RESOURCE_NOT_FOUND`)
  nagging = nagging[0]
  nagging.author = (await util.mongodb.read('users', { uuid: nagging.author }))[0]
  return nagging
}