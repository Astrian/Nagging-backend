const util = require("../../util")

module.exports = async (pager) => {
  let limit = 20
  if (!pager) pager = 0
  let list = await util.mongodb.read('naggings', {}, {
    sort: { time: -1 },
    limit,
    skip: limit*pager
  })
  let next = false
  let res = await util.mongodb.read('naggings', {}, { sort: { time: -1 }, limit: 1, skip: (limit*(pager+1)) })
  if (res.length) next = true
  return {list, next}
}