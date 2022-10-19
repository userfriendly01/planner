import ManagementPagination from "../ManagementPagination";
import {
  NavigateBeforeOutlined,
  NavigateNextOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined
} from "@mui/icons-material";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { workersPerPage } from "globals";
import React from "react";
import {
  expectMockedComponent,
  render,
  setupMockedComponents
} from "testUtils";

const setPageFunc = jest.fn();

jest.mock("@mui/icons-material", () => ({
  AccountBox: jest.fn(),
  NavigateNextOutlined: jest.fn(),
  NavigateBeforeOutlined: jest.fn(),
  SkipNextOutlined: jest.fn(),
  SkipPreviousOutlined: jest.fn(),
  CloseRounded: jest.fn(),
  Edit: jest.fn(),
  InfoOutlined: jest.fn()
}));

const renderComponent = page => {
  return render(<ManagementPagination
    end={workersPerPage}
    length={65}
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
    test("should display start, end & 'of how many' and the first & previous arrows should be disabled", () => {
      const rendered = renderComponent(1);
      expect(rendered.getByText("1", { selector: "span" })).toBeInTheDocument();
      expect(rendered.getByText(/-/)).toBeInTheDocument();
      expect(rendered.getByText("15", { selector: "span" })).toBeInTheDocument();
      expect(rendered.getByText(/of/)).toBeInTheDocument();
      expect(rendered.getByText("65", { selector: "span" })).toBeInTheDocument();
      expect(rendered.getByText(/workers/)).toBeInTheDocument();
      expect(setPageFunc.mock.calls.length).toBe(0);
      expectMockedComponent(rendered, { SkipPreviousOutlined });
      expectMockedComponent(rendered, { NavigateBeforeOutlined });
      expectMockedComponent(rendered, { NavigateNextOutlined });
      expectMockedComponent(rendered, { SkipNextOutlined });
      expect(screen.getByTestId("first")).toHaveAttribute("disabled");
      expect(screen.getByTestId("previous")).toHaveAttribute("disabled");
      expect(screen.getByTestId("next")).not.toHaveAttribute("disabled");
      expect(screen.getByTestId("last")).not.toHaveAttribute("disabled");
    });
  });

  describe("on any page other than the last page", () => {
    const currentPage = 3;
    describe("next page icon is clicked", () => {
      test("should navigate to next page", () => {
        renderComponent(currentPage);
        userEvent.click(screen.getByTestId("next"));
        expect(setPageFunc).toHaveBeenCalledTimes(1);
        expect(setPageFunc).toHaveBeenCalledWith(currentPage + 1);
      });
    });

    describe("last page icon is clicked", () => {
      test("should navigate to the last page", () => {
        renderComponent(currentPage);
        userEvent.click(screen.getByTestId("last"));
        expect(setPageFunc).toHaveBeenCalledTimes(1);
        expect(setPageFunc).toHaveBeenCalledWith(5);
      });
    });
  });

  describe("on any page other than the first page", () => {
    const currentPage = 4;
    describe("previous page icon is clicked", () => {
      test("should navigate to the previous page", () => {
        renderComponent(currentPage);
        userEvent.click(screen.getByTestId("previous"));
        expect(setPageFunc).toHaveBeenCalledTimes(1);
        expect(setPageFunc).toHaveBeenCalledWith(currentPage - 1);
      });
    });

    describe("first page icon is clicked", () => {
      test("should navigate to page 1", () => {
        renderComponent(currentPage);
        userEvent.click(screen.getByTestId("first"));
        expect(setPageFunc).toHaveBeenCalledTimes(1);
        expect(setPageFunc).toHaveBeenCalledWith(1);
      });
    });
  });

  describe("on last page", () => {
    test("the next & last arrows should be disabled", () => {
      renderComponent(5);
      expect(screen.getByTestId("first")).not.toHaveAttribute("disabled");
      expect(screen.getByTestId("previous")).not.toHaveAttribute("disabled");
      expect(screen.getByTestId("next")).toHaveAttribute("disabled");
      expect(screen.getByTestId("last")).toHaveAttribute("disabled");
    });
  });

});
