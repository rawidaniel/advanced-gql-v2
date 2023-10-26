const gql = require("graphql-tag");
const createTestServer = require("./helper");
const FEED = gql`
  {
    feed {
      id
      message
      createdAt
      likes
      views
    }
  }
`;

describe("queries", () => {
  test("feed", async () => {
    const mockFindMany = jest.fn(() => [
      {
        id: 1,
        message: "hello",
        createdAt: 12345839,
        likes: 20,
        views: 300,
      },
    ]);
    const { query } = createTestServer({
      user: { id: 1 },
      models: {
        Post: {
          findMany: mockFindMany,
        },
      },
    });

    const res = await query({ query: FEED });
    // console.log(res);
    expect(res).toMatchSnapshot();
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });
});
