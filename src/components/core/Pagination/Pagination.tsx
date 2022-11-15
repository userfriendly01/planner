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


const Pagination = (props: PaginationProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const length = tableState.pagination.length;
  const numPages = Math.ceil(length / tableState.pagination.usersPerPage);
  const onFirstPage = tableState.pagination.pageNumber === 1;
  const onLastPage = tableState.pagination.pageNumber === numPages;
  const endingNumber = tableState.pagination.endingUserIndex > length ? length : tableState.pagination.endingUserIndex;

  return (
    <PaginationWrapper>
      <ShowingSection>
        <Highlight>{tableState.pagination.startingUserIndex}</Highlight>-<Highlight>{endingNumber}</Highlight> of <Highlight>{length}</Highlight> workers
      </ShowingSection>
      <NavArrowsWrapper>
        <NavArrow
          data-testid="first"
          disabled={onFirstPage}
          onClick={!onFirstPage ? () => setTableState({
            ...tableState,
            pagination: {
              ...tableState.pagination,
              pageNumber: 1
            }
          }) : null}
        >
          <Tooltip title="First page"><SkipPreviousOutlined/></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="previous"
          disabled={onFirstPage}
          onClick={!onFirstPage ? () => setTableState({
            ...tableState,
            pagination: {
              ...tableState.pagination,
              pageNumber: tableState.pagination.pageNumber - 1
            }
          }) : null}
        >
          <Tooltip title="Previous page"><NavigateBeforeOutlined /></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="next"
          disabled={onLastPage}
          onClick={!onLastPage ? () => setTableState({
            ...tableState,
            pagination: {
              ...tableState.pagination,
              pageNumber: tableState.pagination.pageNumber + 1
            }
          }) : null}
        >
          <Tooltip title="Next page"><NavigateNextOutlined /></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="last"
          disabled={onLastPage}
          onClick={!onLastPage ? () => setTableState({
            ...tableState,
            pagination: {
              ...tableState.pagination,
              pageNumber: numPages - 1
            }
          }) : null}
        >
          <Tooltip title="Last page"><SkipNextOutlined /></Tooltip>
        </NavArrow>
      </NavArrowsWrapper>
    </PaginationWrapper>
  );
};

export default Pagination;