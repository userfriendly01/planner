import ManagementPagination from "../ManagementPagination";
// import { Tooltip } from "@material-ui/core";
import {
  NavigateNextOutlined,
  NavigateBeforeOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined
} from "@material-ui/icons";
// import {
//   screen,
//   waitFor
// } from "@testing-library/react"j
// import { workersPerPage } from "globals";
import React from "react";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  render,
  setupMockedComponents
} from "testUtils";

const setPageFunc = jest.fn();

jest.mock("@material-ui/icons", () => ({
  NavigateNextOutlined: jest.fn(),
  NavigateBeforeOutlined: jest.fn(),
  SkipNextOutlined: jest.fn(),
  SkipPreviousOutlined: jest.fn()
}));

const renderWithProps = page => {
  return render(<ManagementPagination
    end={10}
    length={15}
    page={page}
    setPage={setPageFunc}
    start={1} />);
};

describe("<ManagementPagination />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      NavigateNextOutlined,
      NavigateBeforeOutlined,
      SkipNextOutlined,
      SkipPreviousOutlined
    });
  });

  describe("initial render (on page 1)", () => {
    test("should display start, end, and of how many", () => {
      const rendered = renderWithProps(1);
      expect(rendered.getByText("1", { selector: "span" })).toBeInTheDocument();
      expect(rendered.getByText(/-/)).toBeInTheDocument();
      expect(rendered.getByText("10", { selector: "span" })).toBeInTheDocument();
      expect(rendered.getByText(/of/)).toBeInTheDocument();
      expect(rendered.getByText("15", { selector: "span" })).toBeInTheDocument();
      expect(rendered.getByText(/workers/)).toBeInTheDocument();
      expect(setPageFunc.mock.calls.length).toBe(0);
      expectMockedComponent(rendered, { SkipPreviousOutlined });
      expectMockedComponent(rendered, { NavigateBeforeOutlined });
      expectMockedComponent(rendered, { NavigateNextOutlined });
      expectMockedComponent(rendered, { SkipNextOutlined });
    });
    test("the first & previous arrows should be disabled", () => {
      renderWithProps(1);
      expectOnlyPassedProps(SkipPreviousOutlined, { onClick: null });
      expectOnlyPassedProps(NavigateBeforeOutlined, { onClick: null });
    });

    describe("on last page", () => {
      test("the next & last arrows should be enabled", () => {
        renderWithProps(2);
        expectOnlyPassedProps(NavigateNextOutlined, { onClick: null });
        expectOnlyPassedProps(SkipNextOutlined, { onClick: null });
      });
    });
  });

  // test("when we click a page button, we should fire the function sent in, sent with the correct page number", () => {
  //   const rendered = renderWithProps(10, workersPerPage + 1, 1, setPageFunc, 1);
  //   fireEvent.click(rendered.getByText("2", { selector: "button" }));
  //   expect(setPageFunc.mock.calls.length).toBe(1);
  //   expect(setPageFunc.mock.calls[0][0]).toBe(2);
  // });

});