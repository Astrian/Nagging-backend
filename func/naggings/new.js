const util = require('../../util')
const { v4: uuidv4 } = require('uuid')

module.exports = async (content, author) => {
  let time = Date.parse(new Date())
  let uuid = await genUuid()
  let nagging = {content, author, time, uuid}
  await util.mongodb.write('naggings', [nagging])
  nagging = await util.mongodb.read('naggings', {uuid})
  return nagging[0]
}

async function genUuid() {
  let uuid = uuidv4()
  let res = await util.mongodb.read('naggings', {uuid})
  if (res.length) uuid = await genUuid()
  return uuid
}