const util = require("../../util")

module.exports = async (user) => {
  await util.mongodb.delete('sessions', { user })
}