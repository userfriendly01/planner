import { ClearRounded } from "@material-ui/icons";
import SearchBox from "../SearchBox";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  fireEvent,
  render,
  setupMockedComponents
} from "testUtils";

const mockFunction = jest.fn();

jest.mock("@material-ui/icons", () => ({
  __esModule: true,
  ClearRounded: jest.fn()
}));

const renderComponent = searchBy => {
  return render(<SearchBox searchBy={searchBy} setSearch={mockFunction} />);
};

describe("<SearchBox />", () => {
  beforeEach(() => {
    mockFunction.mockClear();
    setupMockedComponents({
      ClearRounded
    });
  });
  test("the initial state should be just an empty text field, with the correct label", () => {
    const rendered = renderComponent("");
    expect(rendered.getByDisplayValue("")).toBeTruthy();
    expect(rendered.getByLabelText("Search")).toBeTruthy();
    expectMockedComponent(rendered, { ClearRounded }, 0);
    expect(mockFunction.mock.calls.length).toBe(0);
  });
  test("when we update the value, we should fire the event being sent to the component", () => {
    const rendered = renderComponent("test");
    expect(rendered.getByDisplayValue("test")).toBeTruthy();
    expect(rendered.getByLabelText("Search")).toBeTruthy();
    act(() => {
      fireEvent.change(rendered.getByLabelText("Search"), { target: { value: "name" }});
    });
    expectMockedComponent(rendered, { ClearRounded }, 1);
    expect(mockFunction.mock.calls.length).toBe(1);
    expect(mockFunction.mock.calls[0][0]).toBe("name");
  });
  test("when we update the value, and then click the clear button, we should send '' back to the parent", () => {
    const rendered = renderComponent("test");
    expect(rendered.getByDisplayValue("test")).toBeTruthy();
    expect(rendered.getByLabelText("Search")).toBeTruthy();
    act(() => {
      fireEvent.change(rendered.getByLabelText("Search"), { target: { value: "name" }});
    });
    expectMockedComponent(rendered, { ClearRounded }, 1);
    expect(mockFunction.mock.calls.length).toBe(1);
    expect(mockFunction.mock.calls[0][0]).toBe("name");
    act(() => {
      fireEvent.click(rendered.getByTestId("clearButton"));
    });
    expect(mockFunction.mock.calls.length).toBe(2);
    expect(mockFunction.mock.calls[1][0]).toBe("");
  });
});
