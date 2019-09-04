import ManagementPagination from "../ManagementPagination";
import React from "react";
import {
  fireEvent,
  render
} from "testUtils";

const setPageFunc = jest.fn();

const renderWithProps = (end, length, page, setPage, start) => {
  return render(<ManagementPagination
    end={end}
    length={length}
    page={page}
    setPage={setPage}
    start={start} />);
};

describe("<ManagementPagination />", () => {
  beforeEach(() => {
    setPageFunc.mockClear();
  });
  test("we should correctly show the start, end, and of how many", () => {
    const rendered = renderWithProps(10, 15, 1, setPageFunc, 1);
    expect(rendered.getByText(/Showing/)).toBeInTheDocument();
    expect(rendered.getByText("1", { selector: "span" })).toBeInTheDocument();
    expect(rendered.getByText(/to/)).toBeInTheDocument();
    expect(rendered.getByText("10", { selector: "span" })).toBeInTheDocument();
    expect(rendered.getByText(/of/)).toBeInTheDocument();
    expect(rendered.getByText("15", { selector: "span" })).toBeInTheDocument();
    expect(rendered.getByText(/workers/)).toBeInTheDocument();
    expect(setPageFunc.mock.calls.length).toBe(0);
  });
  test("with a length of 15 we should show two buttons with the correct page numbers", () => {
    const rendered = renderWithProps(10, 15, 1, setPageFunc, 1);
    expect(rendered.getByText("1", { selector: "button" })).toBeInTheDocument();
    expect(rendered.getByText("2", { selector: "button" })).toBeInTheDocument();
    expect(setPageFunc.mock.calls.length).toBe(0);
  });
  test("when we click a page button, we should fire the function sent in, sent with the correct page number", () => {
    const rendered = renderWithProps(10, 15, 1, setPageFunc, 1);
    fireEvent.click(rendered.getByText("2", { selector: "button" }));
    expect(setPageFunc.mock.calls.length).toBe(1);
    expect(setPageFunc.mock.calls[0][0]).toBe(2);
  });
});