// src/data/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const link = new HttpLink({ uri: 'http://localhost:3001/graphql' }) // ✅ include /graphql

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
