import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({
  port: 3001,
  cors: {
    origin: "http://localhost:5173", // 👈 allow frontend
    credentials: true,
  },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
