const util = require('../util')
const {ForbiddenError} = require('apollo-server-errors')

module.exports = async (session) => {
  let res = await util.mongodb.read('sessions', session)
  if (!res.length) throw new ForbiddenError(`Your session is not vaild.`)
}