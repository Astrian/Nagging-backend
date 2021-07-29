const util = require('../../util')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

module.exports = async (args) => {
  // Check does a user existed in this server
  let res = await util.mongodb.read('users', {})
  if (res.length) throw new Error(JSON.stringify({
    info: `This server is user-existed.`,
    code: `USER_EXIST`
  }))

  // Assign a UUID
  args.uuid = await assignUUID()

  // Hash password
  args.password = await hashPassword(args.password)

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