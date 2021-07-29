const { ApolloServer, gql } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const func = require('./func')
const {ApolloError, UserInputError } = require('apollo-server-errors')
const { Console } = require('console')

const typeDefs = fs.readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf8' })

const resolvers = {
  Query: {
    user: async (parent, args) => {
      return await func.users.getUsers(args.username, args.uuid)
    }
  },
  Mutation: {
    createUser: async (parent, args) => {
      await func.users.createUser(args) 
      return
    },
    login: async (parent, args) => {
      let cookie = await func.users.login(args) 
      return cookie
    },
    postNagging: async (parent, args, context) => {
      await func.checkSession(context.session)
      return await func.naggings.new(args.content, context.session.user)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let cookieRaw = req.headers.cookie || ''
    let cookie = cookieRaw.split('; ')
    let session = {}
    for(let i in cookie) {
      if (cookie[i].split('=')[0] === 'key') session.key = cookie[i].split('=')[1]
      if (cookie[i].split('=')[0] === 'user') session.user = cookie[i].split('=')[1]
    }
    return { session }
  }
})

server.listen(3000).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})