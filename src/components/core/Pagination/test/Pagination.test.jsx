import Pagination from "../Pagination";
import { NavArrow } from "../Pagination.Styles";
import { Tooltip } from "@mui/material";
import { theme } from "globals";
import React from "react";
import { ThemeProvider } from "styled-components";
import {
  act,
  render,
  setupMockedComponents
} from "testUtils";

jest.mock("@mui/icons-material", () => ({
  __esModule: true,
  NavigateBeforeOutlined: jest.fn(),
  NavigateNextOutlined: jest.fn(),
  SkipNextOutlined: jest.fn(),
  SkipPreviousOutlined: jest.fn()
}));

jest.mock("@mui/material", () => ({
  __esModule: true,
  Tooltip: jest.fn()
}));

jest.mock("../Pagination.Styles", () => ({
  __esModule: true,
  NavArrow: jest.fn(),
  Highlight: jest.requireActual("../Pagination.Styles").Highlight,
  NavArrowsWrapper: jest.requireActual("../Pagination.Styles").NavArrowsWrapper,
  PaginationWrapper: jest.requireActual("../Pagination.Styles").PaginationWrapper,
  ShowingSection: jest.requireActual("../Pagination.Styles").ShowingSection
}));

const defaultTableState = {
  pagination: {
    usersPerPage: 25,
    pageNumber: 1,
    length: 100,
    startingUserIndex: 1,
    endingUserIndex: 25
  }
};
const setTableState = jest.fn();

const renderComponent = tableState => {
  return render(
    <ThemeProvider theme={theme}>
      <Pagination tableState={tableState} setTableState={setTableState}/>
    </ThemeProvider>
  );
};
describe("Pagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockedComponents({
      NavArrow,
      Tooltip
    });
  });
  describe("initial render", () => {
    describe("user is on  first page", () => {
      test("first arrow should be disabled", () => {
        const rendered = renderComponent(defaultTableState);
        expect(rendered.container).toHaveTextContent("1-25 of 100 workers");
        expect(NavArrow.mock.calls.length).toBe(4);
        expect(NavArrow.mock.calls[0][0].disabled).toBe(true);
        expect(NavArrow.mock.calls[1][0].disabled).toBe(true);
        expect(NavArrow.mock.calls[2][0].disabled).toBe(false);
        expect(NavArrow.mock.calls[3][0].disabled).toBe(false);

        render(NavArrow.mock.calls[0][0].children);
        expect(Tooltip.mock.calls[0][0].title).toBe("First page");
        render(NavArrow.mock.calls[1][0].children);
        expect(Tooltip.mock.calls[1][0].title).toBe("Previous page");
        render(NavArrow.mock.calls[2][0].children);
        expect(Tooltip.mock.calls[2][0].title).toBe("Next page");
        render(NavArrow.mock.calls[3][0].children);
        expect(Tooltip.mock.calls[3][0].title).toBe("Last page");
      });
    });
    describe("user is not on first or last page", () => {
      const tableState = {
        pagination: {
          usersPerPage: 25,
          pageNumber: 2,
          length: 100,
          startingUserIndex: 26,
          endingUserIndex: 50
        }
      };
      test("all arrows should be enabled", () => {
        const rendered = renderComponent(tableState);
        expect(rendered.container).toHaveTextContent("26-50 of 100 workers");
        expect(NavArrow.mock.calls.length).toBe(4);
        expect(NavArrow.mock.calls[0][0].disabled).toBe(false);
        expect(NavArrow.mock.calls[1][0].disabled).toBe(false);
        expect(NavArrow.mock.calls[2][0].disabled).toBe(false);
        expect(NavArrow.mock.calls[3][0].disabled).toBe(false);
      });
    });
    describe("user is on last page", () => {
      const tableState = {
        pagination: {
          usersPerPage: 25,
          pageNumber: 4,
          length: 100,
          startingUserIndex: 76,
          endingUserIndex: 100
        }
      };
      test("last arrow should be disabled", () => {
        const rendered = renderComponent(tableState);
        expect(rendered.container).toHaveTextContent("76-100 of 100");
        expect(NavArrow.mock.calls.length).toBe(4);
        expect(NavArrow.mock.calls[0][0].disabled).toBe(false);
        expect(NavArrow.mock.calls[1][0].disabled).toBe(false);
        expect(NavArrow.mock.calls[2][0].disabled).toBe(true);
        expect(NavArrow.mock.calls[3][0].disabled).toBe(true);
      });
    });
  });
  describe("firstPageArrow is clicked", () => {
    const tableState = {
      pagination: {
        usersPerPage: 25,
        pageNumber: 4,
        length: 100,
        startingUserIndex: 76,
        endingUserIndex: 100
      }
    };
    test("should setTableState pageNumber to 1", () => {
      renderComponent(tableState);
      const goToFirstPage = NavArrow.mock.calls[0][0].onClick;
      act(() => goToFirstPage());
      expect(setTableState).toHaveBeenCalledTimes(1);
      expect(setTableState).toHaveBeenCalledWith({
        pagination: {
          ...tableState.pagination,
          pageNumber: 1
        }
      });
    });
  });
  describe("previousArrow is clicked", () => {
    const tableState = {
      pagination: {
        usersPerPage: 25,
        pageNumber: 4,
        length: 100,
        startingUserIndex: 76,
        endingUserIndex: 100
      }
    };
    test("should setTableState to previous pageNumber", () => {
      renderComponent(tableState);
      const goToPreviousPage = NavArrow.mock.calls[1][0].onClick;
      act(() => goToPreviousPage());
      expect(setTableState).toHaveBeenCalledTimes(1);
      expect(setTableState).toHaveBeenCalledWith({
        pagination: {
          ...tableState.pagination,
          pageNumber: 3
        }
      });
    });
  });
  describe("nextArrow is clicked", () => {
    test("should setTableState to next pageNumber", () => {
      renderComponent(defaultTableState);
      const goToNextPage = NavArrow.mock.calls[2][0].onClick;
      act(() => goToNextPage());
      expect(setTableState).toHaveBeenCalledTimes(1);
      expect(setTableState).toHaveBeenCalledWith({
        pagination: {
          ...defaultTableState.pagination,
          pageNumber: 2
        }
      });
    });
  });
  describe("lastPageArrow is clicked", () => {
    test("should setTableState pageNumber to 4", () => {
      renderComponent(defaultTableState);
      const goToLastPage = NavArrow.mock.calls[3][0].onClick;
      act(() => goToLastPage());
      expect(setTableState).toHaveBeenCalledTimes(1);
      expect(setTableState).toHaveBeenCalledWith({
        pagination: {
          ...defaultTableState.pagination,
          pageNumber: 3
        }
      });
    });
  });
  describe("ending user index is greater than length", () => {
    const tableState = {
      pagination: {
        usersPerPage: 25,
        pageNumber: 4,
        length: 100,
        startingUserIndex: 76,
        endingUserIndex: 101
      }
    };
    test("should setTableState to previous pageNumber", () => {
      const rendered = renderComponent(tableState);
      expect(rendered.container).toHaveTextContent("76-100 of 100");
    });
  });
});