import {
  Cell,
  Column,
  flexRender,
  getPaginationRowModel,
  HeaderGroup,
  Row,
  useReactTable
} from "@tanstack/react-table";
import { render } from "testUtils";
import {
  LMDSTable, LMDSTableProps
} from "../LMDSTable";
import React from "react";
import {
  BodyText,
  DataTable,
  Heading,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@lmig/lmds-react";

jest.mock("@tanstack/react-table", () => ({
  ColumnDef: jest.fn(),
  flexRender: jest.fn(),
  getCoreRowModel: jest.fn(),
  getExpandedRowModel: jest.fn(),
  getPaginationRowModel: jest.fn(),
  getSortedRowModel: jest.fn(),
  SortingState: jest.fn(),
  useReactTable: jest.fn()
}));

jest.mock("@lmig/lmds-react", () => ({
  BodyText: jest.fn(),
  DataTable: jest.fn(),
  Heading: jest.fn(),
  Skeleton: jest.fn(),
  Table: jest.fn(),
  TableBody: jest.fn(),
  TableCell: jest.fn(),
  TableHeader: jest.fn(),
  TableProps: jest.fn(),
  TableRow: jest.fn()
}));

jest.mock("globals/interfaces", () => ({
  Pagination: jest.fn()
}));

interface TestData {
  name: string;
}

describe("LMDSTable", () => {
  const mockUseReactTable = (rows: Row<TestData>[]) => {
    (useReactTable as jest.Mock).mockReturnValue({
      getHeaderGroups: jest.fn().mockReturnValue(
        [{
          headers: [
            {
              id: "name",
              getContext: jest.fn().mockReturnValue("context"),
              column: {
                getIsSorted: jest.fn().mockReturnValue(false),
                getCanSort: jest.fn().mockReturnValue(true),
                getToggleSortingHandler: jest.fn(),
                columnDef: {
                  header: "Name"
                }
              } as unknown as Column<TestData>
            }
          ]
        }] as unknown as HeaderGroup<TestData>[]
      ),
      getRowModel: jest.fn().mockReturnValue({
        rows
      })
    });
  };

  const renderFullTable = (props: LMDSTableProps<TestData, unknown>) => {
    const tableComponent = render(<LMDSTable {...props} />);
    render((DataTable as jest.Mock).mock.calls[0][0].children);
    render((Table as jest.Mock).mock.calls[0][0].children);
    render((TableHeader as jest.Mock).mock.calls[0][0].children);
    render((TableBody as jest.Mock).mock.calls[0][0].children);
    (TableRow as jest.Mock).mock.calls.forEach(call => {
      if (call.length) {
        render(call[0].children);
      }
    });

    (TableCell as jest.Mock).mock.calls.forEach(call => {
      if (call.length) {
        render(call[0].children);
      }
    });

    return tableComponent;
  };

  beforeAll(() => {
    // This is the same bug Faith found a while ago, 
    // It causes the mock of TableRow to get called 
    // some random time with no args when being set 
    // up. So this is here to fix that hehe
    mockUseReactTable([]);
    render(<LMDSTable isLoading={false} data={[]} columns={[]} />);
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("table has data", () => {
    it("should render the table with the correct data", async () => {
      mockUseReactTable(
        [{
          id: "row-1",
          getIsExpanded: jest.fn().mockReturnValue(false),
          getVisibleCells: jest.fn().mockReturnValue([
              {
                id: "name",
                getContext: jest.fn().mockReturnValue("context"),
                column: {
                  columnDef: {
                    cell: "John Doe"
                  }
                }
              } as unknown as Cell<TestData, unknown>
          ])
        }] as unknown as Row<TestData>[]
      );

      renderFullTable({
        data: [{
          name: "John Doe"
        }],
        columns: [{
          id: "name",
          cell: "name"
        }]
      });

      expect(useReactTable).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: [{
            id: "name",
            cell: "name"
          }],
          data: [{
            name: "John Doe"
          }]
        })
      );

      expect(TableRow).toHaveBeenCalledTimes(2);
      expect(TableCell).toHaveBeenCalledTimes(2);
      expect(flexRender).toHaveBeenCalledWith("Name", "context");
      expect(flexRender).toHaveBeenCalledWith("John Doe", "context");
    });

    it("should expand the table when getIsExpanded returns true", async () => {
      const getIsExpandedFunc = jest.fn().mockReturnValue(true);
      const rowChild = (
        <div>
          I AM A ROW CHILD
        </div>
      );

      mockUseReactTable(
        [{
          id: "row-1",
          getAllCells: jest.fn().mockReturnValue([{}]),
          getIsExpanded: getIsExpandedFunc,
          getVisibleCells: jest.fn().mockReturnValue([
              {
                id: "name",
                getContext: jest.fn().mockReturnValue("context"),
                column: {
                  columnDef: {
                    cell: "John Doe"
                  }
                }
              } as unknown as Cell<TestData, unknown>
          ]),
          original: {
            children: rowChild
          }
        }] as unknown as Row<TestData>[]
      );

      const { getByText } = renderFullTable({
        data: [{
          name: "John Doe"
        }],
        columns: [{
          id: "name",
          cell: "name"
        }]
      });

      expect(useReactTable).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: [{
            id: "name",
            cell: "name"
          }],
          data: [{
            name: "John Doe"
          }]
        })
      );
      expect((useReactTable as jest.Mock).mock.calls[0][0].getRowCanExpand()).toBeTruthy();
      expect(TableRow).toHaveBeenCalledTimes(3);
      expect(TableCell).toHaveBeenCalledTimes(2);
      expect(flexRender).toHaveBeenCalledWith("Name", "context");
      expect(flexRender).toHaveBeenCalledWith("John Doe", "context");
      expect(getByText("I AM A ROW CHILD")).toBeInTheDocument();

    });
  });

  describe("table has no data", () => {
    beforeEach(() => {
      mockUseReactTable([]);
    });

    it("should render 1 skeleton for each pagination row when isLoading is true", async () => {
      renderFullTable({
        isLoading: true,
        data: [],
        columns: [{
          id: "name",
          cell: "name"
        }]
      });

      expect(useReactTable).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: [{
            id: "name",
            cell: "name"
          }],
          data: []
        })
      );

      expect(TableRow).toHaveBeenCalledTimes(11);
      expect(TableCell).toHaveBeenCalledTimes(11);
      expect(Skeleton).toHaveBeenCalledTimes(10);
    });

    it("should render no data found message when isLoading is false and data is empty", async () => {
      renderFullTable({
        data: [],
        columns: [{
          id: "name",
          cell: "name"
        }]
      });

      expect(useReactTable).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: [{
            id: "name",
            cell: "name"
          }],
          data: []
        })
      );

      expect(TableRow).toHaveBeenCalledTimes(2);
      expect(TableCell).toHaveBeenCalledTimes(1);
      expect(flexRender).toHaveBeenCalledWith("Name", "context");
      expect(BodyText).toHaveBeenCalledTimes(1);
      expect((BodyText as jest.Mock).mock.calls[0][0].children).toBe("No data was found.");
    });
  });

  describe("table header is sorted in a direction", () => {
    it.each([
      {
        tanstackSort: false,
        lmdsSort: "none"
      },
      {
        tanstackSort: "asc",
        lmdsSort: "ascending"
      },
      {
        tanstackSort: "desc",
        lmdsSort: "descending"
      }
    ])("should render the table header with the $lmdsSort when tanstack sort is $tanstackSort", async ({
      tanstackSort, lmdsSort
    }) => {
      (useReactTable as jest.Mock).mockReturnValue({
        getHeaderGroups: jest.fn().mockReturnValue(
          [{
            headers: [
              {
                id: "name",
                getContext: jest.fn().mockReturnValue("context"),
                column: {
                  getIsSorted: jest.fn().mockReturnValue(tanstackSort),
                  getCanSort: jest.fn().mockReturnValue(true),
                  getToggleSortingHandler: jest.fn(),
                  columnDef: {
                    header: "Name"
                  }
                } as unknown as Column<TestData>
              }
            ]
          }] as unknown as HeaderGroup<TestData>[]
        ),
        getRowModel: jest.fn().mockReturnValue({
          rows: []
        })
      });

      renderFullTable({
        data: [],
        columns: []
      });

      expect((TableCell as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          type: "colHead",
          isSortable: true,
          sortDirection: lmdsSort
        })
      );

    });
  });

  it("should enable pagination API and render a page size amount of skeletons when isLoading is true", () => {
    const pagination = {
      pageSize: 20,
      pageIndex: 0
    };

    mockUseReactTable([]);
    renderFullTable({
      isLoading: true,
      data: [],
      columns: [{
        id: "name",
        cell: "name"
      }],
      pagination
    });

    expect(useReactTable).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          pagination
        })
      })
    );
    expect(getPaginationRowModel).toHaveBeenCalled();
    expect(TableRow).toHaveBeenCalledTimes(pagination.pageSize + 1);
    expect(Skeleton).toHaveBeenCalledTimes(pagination.pageSize);
  });

  it("should render table header when provided", () => {
    const tableName = "My Cool Test Table";

    mockUseReactTable([]);
    renderFullTable({
      tableName,
      data: [],
      columns: []
    });

    expect((Heading as jest.Mock).mock.calls[0][0].children).toBe(tableName);
  });
});