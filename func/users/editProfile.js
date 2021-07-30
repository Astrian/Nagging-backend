const util = require("../../util")

module.exports = async (args, uuid) => {
  console.log(args)
  if (args.username) await util.mongodb.edit('users', {uuid}, {username: args.username})
  if (args.bio) await util.mongodb.edit('users', {uuid}, {bio: args.bio})
  if (args.fullname) await util.mongodb.edit('users', {uuid}, {fullname: args.fullname})
}