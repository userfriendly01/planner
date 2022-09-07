import {
  Highlight,
  NavArrow,
  NavArrowsWrapper,
  PaginationWrapper,
  ShowingSection
} from "./ManagementPagination.Styles";
import { Tooltip } from "@mui/material";
import {
  NavigateBeforeOutlined,
  NavigateNextOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined
} from "@mui/icons-material";
import { workersPerPage } from "globals";
import PropTypes from "prop-types";
import React from "react";

const ManagementPagination = props => {
  const {
    end,
    length,
    page,
    setPage,
    start
  } = props;

  const numWorkers = length;
  const numPages = Math.ceil(numWorkers / workersPerPage);
  const onFirstPage = page === 1;
  const onLastPage = page === numPages;

  return (
    <PaginationWrapper>
      <ShowingSection>
        <Highlight>{start}</Highlight>-<Highlight>{end}</Highlight> of <Highlight>{length}</Highlight> workers
      </ShowingSection>
      <NavArrowsWrapper>
        <NavArrow
          data-testid="first"
          disabled={onFirstPage}
          onClick={!onFirstPage ? () => setPage(1) : null}
        >
          <Tooltip title="First page"><SkipPreviousOutlined/></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="previous"
          disabled={onFirstPage}
          onClick={!onFirstPage ? () => setPage(page - 1) : null}
        >
          <Tooltip title="Previous page"><NavigateBeforeOutlined /></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="next"
          disabled={onLastPage}
          onClick={!onLastPage ? () => setPage(page + 1) : null}
        >
          <Tooltip title="Next page"><NavigateNextOutlined /></Tooltip>
        </NavArrow>
        <NavArrow
          data-testid="last"
          disabled={onLastPage}
          onClick={!onLastPage ? () => setPage(numPages) : null}
        >
          <Tooltip title="Last page"><SkipNextOutlined /></Tooltip>
        </NavArrow>
      </NavArrowsWrapper>
    </PaginationWrapper>
  );
};

ManagementPagination.propTypes = {
  end: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  start: PropTypes.number.isRequired
};

export default ManagementPagination;
