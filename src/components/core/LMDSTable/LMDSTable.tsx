import React, {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useState
} from "react";
import {
  BodyText,
  DataTable,
  Heading,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableProps,
  TableRow
} from "@lmig/lmds-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { Pagination } from "globals/interfaces";
import "./LMDSTable.scss";

export interface LMDSTableProps<TData, TColumn> extends TableProps {
  data: (TData & { children?: ReactElement })[];
  columns: ColumnDef<(TData & { children?: ReactElement }), TColumn>[];
  pagination?: Pagination;
  setPagination?: Dispatch<SetStateAction<Pagination>>
  isLoading?: boolean;
  tableName?: string;
}

export const LMDSTable = <TData, TColumn>({
  data,
  columns,
  pagination,
  setPagination,
  tableName = null,
  isLoading = false,
  ...rest
}: LMDSTableProps<TData, TColumn>): ReactElement => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      ...pagination && {
        pagination
      }
    },
    ...pagination && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel()
  });

  return (
    <DataTable className="lmds-table">
      {tableName && (
        <Heading type="h4-bold">
          {tableName}
        </Heading>
      )}
      <Table spacing="micro" {...rest}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                let sortDirection: "none" | "ascending" | "descending" = "none";
                if (header.column.getIsSorted() === "asc") {
                  sortDirection = "ascending";
                } else if (header.column.getIsSorted() === "desc") {
                  sortDirection = "descending";
                }

                return (
                  <TableCell
                    key={header.id}
                    type="colHead"
                    isSortable={header.column.getCanSort()}
                    onClick={header.column.getToggleSortingHandler()}
                    sortDirection={sortDirection}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading && Array.from(Array(pagination?.pageSize || 10)).map((_, i) => (
            <TableRow key={`row-${i}`}>
              {Array.from(Array(columns.length)).map((__, j) => (
                <TableCell key={`cell-${j}`}>
                  <Skeleton height="small" />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!isLoading && !data.length && (
            <TableRow>
              <td
                className="lmig-Table-cell lmig-Table-cell--align-left lmig-Table-cell--vertical-align-middle"
                colSpan={columns.length}
              >
                <BodyText className="table-no-data" type="lead">
                  No data was found.
                </BodyText>
              </td>
            </TableRow>
          )}
          {!isLoading && table.getRowModel().rows.map(row => (
            <Fragment key={row.id}>
              <TableRow id={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} id={cell.id} {...cell.column.columnDef.meta}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {row.getIsExpanded() && (
                <TableRow rowDepth={6}>
                  <td
                    className="expanded-cell lmig-Table-cell lmig-Table-cell--align-left lmig-Table-cell--vertical-align-middle"
                    colSpan={row.getAllCells().length}
                  >
                    {row.original.children}
                  </td>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </DataTable>
  );
};
