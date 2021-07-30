const util = require('../../util')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { ApolloError } = require('apollo-server-errors')
const md5 = require('md5')

module.exports = async (args) => {
  // Check does a user existed in this server
  let res = await util.mongodb.read('users', {})
  if (res.length) throw new ApolloError(`This server is user-existed.`, `USER_ALREADY_EXIST`)

  // Assign a UUID
  args.uuid = await assignUUID()

  // Hash password
  args.password = await hashPassword(args.password)

  // Administrator identify
  args.identify = 1

  // Write default fullname
  args.fullname = args.username

  // Write default avatar
  args.avatar = `https://www.gravatar.com/avatar/${md5(args.email)}?s=512`

  // Write user into database
  await util.mongodb.write('users', [args])
  return
}

const hashPassword = async password => {
  return new Promise((res, rej) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) rej(err)
      else res(hash)
    })
  })
}

async function assignUUID() {
  let uuid = uuidv4()
  return uuid
}