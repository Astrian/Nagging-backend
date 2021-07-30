const util = require("../../util")
const bcrypt = require('bcrypt')
const { ApolloError, AuthenticationError } = require('apollo-server-errors')

module.exports = async (uuid, args) => {
  let user = await util.mongodb.read('users', { uuid })
  user = user[0]
  if (!(await checkPassword(args.oriPwd, user.password))) {
    throw new AuthenticationError(`The password you input is not match to the account.`)
  }
  await util.mongodb.edit('users', { uuid }, { password: await hashPassword(args.newPwd) })
}

const checkPassword = async (password, hash) => {
  return new Promise((res, rej) => {
    bcrypt.compare(password, hash, function(err, result) {
      if (err) rej(err)
      else res(result)
    })
  })
}

const hashPassword = async password => {
  return new Promise((res, rej) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) rej(err)
      else res(hash)
    })
  })
}