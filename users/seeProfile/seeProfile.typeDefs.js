const typeDefs = `#graphql
  type Query {
    seeProfile(username: String!): User
  }
`;

export default typeDefs;
