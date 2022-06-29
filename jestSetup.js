require("jest-dom/extend-expect");
require("jest-styled-components");

const { mockStore } = require("./__test__/testUtils");

beforeEach(() => {
  mockStore.reset();
});

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  // console.warn = jest.fn();
});