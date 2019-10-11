import SearchBox from "../SearchBox";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  fireEvent,
  render
} from "testUtils";

const mockFunction = jest.fn();

const renderComponent = searchBy => {
  return render(<SearchBox searchBy={searchBy} setSearch={mockFunction} />);
};

describe("<SearchBox />", () => {
  beforeEach(() => {
    mockFunction.mockClear();
  });
  test("the initial state should be just an empty text field, with the correct label", () => {
    const rendered = renderComponent("");
    expect(rendered.getByDisplayValue("")).toBeTruthy();
    expect(rendered.getByLabelText("Search")).toBeTruthy();
    expect(mockFunction.mock.calls.length).toBe(0);
  });
  test("when we update the value, we should fire the event being sent to the component", () => {
    const rendered = renderComponent("test");
    expect(rendered.getByDisplayValue("test")).toBeTruthy();
    expect(rendered.getByLabelText("Search")).toBeTruthy();
    act(() => {
      fireEvent.change(rendered.getByLabelText("Search"), { target: { value: "name" }});
    });
    expect(mockFunction.mock.calls.length).toBe(1);
    expect(mockFunction.mock.calls[0][0]).toBe("name");
  });
});
