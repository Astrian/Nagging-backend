const util = require('../../util')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

module.exports = async (args) => {
  // Check username and get user details
  let res = await util.mongodb.read('users', {username: args.username})
  if (!res.length) {
    throw new Error(JSON.stringify({
      info: `We cannot find user in this username.`,
      code: `USER_FINDING_NOT_EXIST`
    }))
  }
  res = res[0]
  
  // Check password
  if (!(await checkPassword(args.password, res.password))) {
    throw new Error(JSON.stringify({
      info: `The password with this user is not matched.`,
      code: `PASSWORD_INCORRECT`
    }))
  }

  // Set device name
  if (!args.deviceName) args.deviceName = 'Unknow Device'

  // Generate session
  let uuid = await assignUUID()
  let sessionKey = await keyGenerator(64, res.uuid)

  // Write to Database
  await util.mongodb.write('sessions', [{
    uuid,
    key: sessionKey,
    user: res.uuid,
    genDate: Date.parse(new Date()),
    deviceName: args.deviceName
  }])

  // Return session token
  return {
    user: res.uuid,
    key: sessionKey
  }
}

const checkPassword = async (password, hash) => {
  return new Promise((res, rej) => {
    bcrypt.compare(password, hash, function(err, result) {
      if (err) rej(err)
      else res(result)
    })
  })
}

const assignUUID = async () => {
  let uuid = uuidv4()
  let res = await util.mongodb.read('sessions', {uuid})
  if (res.length) uuid = assignUUID()
  return uuid
}

async function keyGenerator(length, user) {
  var result           = ''
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  let dup = await util.mongodb.read('users', {user, key: result})
  if (dup.length) result = await keyGenerator(length, user)
  return result
}