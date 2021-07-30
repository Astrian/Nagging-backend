const { ApolloServer, gql } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const func = require('./func')
const httpHeadersPlugin = require("apollo-server-plugin-http-headers")
const urldecode = require('urldecode')

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
      return 
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
      context.setCookies.push({name: "session", value: null})
      return await func.users.logout(context.session.uuid, user)
    },
    editProfile: async (parent, args, context) => {
      let user = await func.checkSession(context.session)
      return await func.users.editProfile(args, user)
    },
    changePassword: async (parent, args, context) => {
      let user = await func.checkSession(context.session)
      return await func.users.changePassword(user, args)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [httpHeadersPlugin],
  context: ({ req }) => {
    let cookieRaw = req.headers.cookie || ''
    let useragent = req.headers['user-agent']
    let cookie = cookieRaw.split('; ')
    let session = {}
    for(let i in cookie) {
      if (cookie[i].split('=')[0] === 'session') {
        let sessionRaw = urldecode(cookie[i].split('=')[1])
        session.uuid = sessionRaw.split(', ')[0]
        session.key = sessionRaw.split(', ')[1]
      }
    }
    return { session, useragent, setCookies: new Array(), setHeaders: new Array() }
  }
})

server.listen(3000).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})