const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typedefs");
const resolvers = require("./resolvers");
const { createToken, getUserFromToken } = require("./auth");
const db = require("./db");
const {
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
} = require("./directives");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatdate: FormatDateDirective,
    authenticated: AuthenticationDirective,
    authorized: AuthorizationDirective,
  },
  formatError(error) {
    // console.log(error);
    return error;
  },

  context({ req, connection }) {
    if (connection) {
      return { ...db, ...connection.context };
    }
    const token = req.headers.authorization;
    const user = getUserFromToken(token);
    return { ...db, user, createToken };
  },
  subscriptions: {
    onConnect(params) {
      const token = params.authToken;
      const user = getUserFromToken(token);
      return { user };
    },
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
