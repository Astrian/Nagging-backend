const { ApolloServer, gql } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const func = require('./func')
const {ApolloError, UserInputError} = require('apollo-server-errors')

const typeDefs = fs.readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf8' })

const resolvers = {
  Query: {
    user: async (parent, args) => {
      try {
        res = await func.users.getUsers(args.username, args.uuid)
      } catch (e) {
        console.log(e)
        throw new ApolloError('Server running error', 'SERVER_RUNNING_ERROR')
      }
      return res
    }
  },
  Mutation: {
    createUser: async (parent, args) => {
      try {
        res = await func.users.createUser(args)
      } catch (e) {
        console.log(e)
        throw new ApolloError('Server running error', 'SERVER_RUNNING_ERROR')
      }
      return 'ok'
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen(3000).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})