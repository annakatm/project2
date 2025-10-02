// server/schema.ts
import { gql } from "apollo-server";

export const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    year: Int!
    genre: String!
    director: String
    description: String
    rating: Float
  }

  type Query {
    movies(
      search: String
      genre: String
      sort: String
      order: String
      limit: Int
      offset: Int
    ): [Movie!]!
    movie(id: ID!): Movie
    favorites(userId: ID!): [Movie!]!
  }

  type Mutation {
    rateMovie(movieId: ID!, userId: ID!, value: Float!): Movie
    toggleFavorite(userId: ID!, movieId: ID!): [Movie!]!
  }
`;
