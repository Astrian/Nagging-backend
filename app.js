const { ApolloServer, gql } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const func = require('./func')

const typeDefs = fs.readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf8' })

const resolvers = {
  Query: {
    getUsers: async () => {
      return await func.users.getUsers()
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen(3000).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})