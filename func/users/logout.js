const util = require("../../util")

module.exports = async (uuid, user) => {
  await util.mongodb.delete('sessions', {uuid, user})
}