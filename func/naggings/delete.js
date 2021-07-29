const util = require("../../util")
const {ApolloError} = require('apollo-server-errors')

module.exports = async (uuid, author) => {
  let res = await util.mongodb.read('naggings', {uuid, author})
  if (!res.length) throw new ApolloError('Cannot find the nagging you wish to delete.', `RESOURCE_NOT_FOUND`)
  await util.mongodb.delete('naggings', { uuid })
}