const gql = require("graphql-tag");
const createTestServer = require("./helper");
const { models } = require("../src/db");
const CREATE_POST = gql`
  mutation {
    createPost(input: { message: "hello" }) {
      message
    }
  }
`;

describe("mutations", () => {
  test("createPost", async () => {
    const { mutate } = createTestServer({
      //   input: { message: "hello" },
      user: { id: 1 },
      models: {
        Post: {
          //   createOne: jest.fn((input) => [
          //     {
          //       id: 1,
          //       message: input.message,
          //       createdAt: 12345839,
          //       likes: 20,
          //       views: 300,
          //     },
          //   ]),

          createOne() {
            return { message: "hello" };
          },
        },
      },
    });

    const res = await mutate({ query: CREATE_POST });
    expect(res).toMatchSnapshot();
  });
});
