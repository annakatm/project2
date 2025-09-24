import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({
  port: 3001,
  cors: {
    origin: '*',
    credentials: false
  }
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});




