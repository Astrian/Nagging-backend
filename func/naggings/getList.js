const util = require("../../util")

module.exports = async (pager) => {
  let naggingsList = await util.mongodb.read('naggings', {}, {
    sort: { time: -1 }
  })
  return naggingsList
}