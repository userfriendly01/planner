import {
  Highlight,
  NavArrow,
  NavArrowsWrapper,
  PaginationWrapper,
  ShowingSection
} from "./Pagination.Styles";
import { PaginationProps } from "./Pagination.Interfaces";
import { Tooltip } from "@mui/material";
import {
  NavigateBeforeOutlined,
  NavigateNextOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined
} from "@mui/icons-material";
import React from "react";


export const Pagination = (props: PaginationProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const length = tableState.pagination.length;
  const numPages = Math.ceil(length / tableState.pagination.usersPerPage);
  const onFirstPage = tableState.pagination.pageNumber === 1;
  const onLastPage = tableState.pagination.pageNumber === numPages;
  const startingCount = tableState.pagination.startingUserIndex + 1;
  const endingCount = onLastPage ? length: tableState.pagination.endingUserIndex + 1;

  return (
    <PaginationWrapper>
      <ShowingSection>
        <Highlight>{startingCount}</Highlight>-<Highlight>{endingCount}</Highlight> of <Highlight>{length}</Highlight> workers
      </ShowingSection>
      <NavArrowsWrapper>
        <NavArrow
          data-testid="nav"
          disabled={onFirstPage}
          onClick={() => setTableState({
            ...tableState,
            pagination: {
              ...tableState.pagination,
              pageNumber: 1
            }
          })}
        >
          <Tooltip title="First page"><SkipPreviousOutlined/></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="nav"
          disabled={onFirstPage}
          onClick={() => setTableState({
            ...tableState,
            pagination: {
              ...tableState.pagination,
              pageNumber: tableState.pagination.pageNumber - 1
            }
          })}
        >
          <Tooltip title="Previous page"><NavigateBeforeOutlined /></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="nav"
          disabled={onLastPage}
          onClick={() => setTableState({
            ...tableState,
            pagination: {
              ...tableState.pagination,
              pageNumber: tableState.pagination.pageNumber + 1
            }
          })}
        >
          <Tooltip title="Next page"><NavigateNextOutlined /></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="nav"
          disabled={onLastPage}
          onClick={() => setTableState({
            ...tableState,
            pagination: {
              ...tableState.pagination,
              pageNumber: numPages
            }
          })}
        >
          <Tooltip title="Last page"><SkipNextOutlined /></Tooltip>
        </NavArrow>
      </NavArrowsWrapper>
    </PaginationWrapper>
  );
};

