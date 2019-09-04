require("jest-dom/extend-expect");
require("jest-styled-components");

beforeAll(() => {
  console.error= jest.fn();
  console.warn = jest.fn();
});