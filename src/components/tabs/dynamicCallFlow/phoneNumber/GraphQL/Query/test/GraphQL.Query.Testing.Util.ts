export const QUERY = "query";

const defaultGraphQLResponse: Response = {
  body: null,
  bodyUsed: false,
  arrayBuffer: jest.fn(),
  blob: jest.fn(),
  formData: jest.fn(),
  json: () => Promise.resolve([]),
  text: jest.fn(),
  headers: new Headers(),
  ok: true,
  redirected: false,
  status: 200,
  statusText: "OK",
  type: "basic",
  url: "http://localhost:3000",
  clone: jest.fn()
};

export const mockAccessToken = "testAccessToken";
