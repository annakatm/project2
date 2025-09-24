// apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// Apollo Server v3 standalone accepts JSON POSTs at '/'
const link = new HttpLink({ uri: 'http://localhost:3001/' })

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})


