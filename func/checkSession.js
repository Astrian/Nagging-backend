const util = require('../util')
const {ForbiddenError} = require('apollo-server-errors')

module.exports = async (session) => {
  if(!session.uuid || !session.key) throw new ForbiddenError(`You have not any session key.`)
  let res = await util.mongodb.read('sessions', session)
  if (!res.length) throw new ForbiddenError(`Your session is not vaild.`)
  return res[0].user
}