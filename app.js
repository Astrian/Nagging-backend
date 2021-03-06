const { ApolloServer, gql } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const func = require('./func')
const httpHeadersPlugin = require("apollo-server-plugin-http-headers")
const urldecode = require('urldecode')

const port = process.env.PORT || 4000

const typeDefs = fs.readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf8' })

const resolvers = {
  Query: {
    user: async (parent, args) => {
      return await func.users.getUsers(args.username, args.uuid)
    },
    naggings: async (parent, args) => {
      return await func.naggings.getList(args.pager)
    },
    signalNagging: async (parent, args) => {
      return await func.naggings.getSingle(args.uuid)
    }
  },
  Mutation: {
    createUser: async (parent, args) => {
      await func.users.createUser(args) 
      return
    },
    login: async (parent, args, context) => {
      if (!args.deviceName) args.deviceName = context.useragent
      let cookie = await func.users.login(args) 
      context.setCookies.push({name: "session", value: `${cookie.uuid}, ${cookie.key}`})
      return cookie
    },
    postNagging: async (parent, args, context) => {
      let user = await func.checkSession(context.session)
      return await func.naggings.new(args.content, user)
    },
    deleteNagging: async (parent, args, context) => {
      let user = await func.checkSession(context.session)
      return await func.naggings.delete(args.uuid, user)
    },
    logout: async (parent, args, context) => {
      let user = await func.checkSession(context.session)
      context.setCookies.push({name: "session", value: null, options : { expires: new Date(0) }})
      return await func.users.logout(context.session.uuid, user)
    },
    editProfile: async (parent, args, context) => {
      let user = await func.checkSession(context.session)
      return await func.users.editProfile(args, user)
    },
    changePassword: async (parent, args, context) => {
      let user = await func.checkSession(context.session)
      return await func.users.changePassword(user, args)
    },
    logoutFromAnywhere: async (parent, args, context) => {
      let user = await func.checkSession(context.session)
      context.setCookies.push({name: "session", value: null, options : { expires: new Date(0) }})
      return await func.users.logoutFromAnywhere(user)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [httpHeadersPlugin],
  context: ({ req }) => {
    let sessionRaw = req.headers.session || ''
    let useragent = req.headers['user-agent']
    let session = { uuid: sessionRaw.split(', ')[0], key: sessionRaw.split(', ')[1] }
    return { session, useragent, setCookies: new Array(), setHeaders: new Array() }
  },
  cors: {origin: JSON.parse(process.env.NG_CORSDOMAIN), credentials: true}
})

server.listen(port).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})