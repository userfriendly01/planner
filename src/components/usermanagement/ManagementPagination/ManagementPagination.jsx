import {
  Highlight,
  PageButton,
  PageSection,
  PaginationWrapper,
  ShowingSection
} from "./ManagementPagination.Styles";
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

  const buttons = [];
  const numWorkers = length;
  const numPages = Math.ceil(numWorkers / workersPerPage);

  for (let i = 0; i < numPages; i++) {
    const pageNum = i + 1;
    buttons.push(<PageButton key={i} value={pageNum} pageSelected={page} onClick={() => setPage(pageNum)}>{pageNum}</PageButton>);
  }

  return (
    <PaginationWrapper>
      <ShowingSection>
        Showing <Highlight>{start}</Highlight> to <Highlight>{end}</Highlight> of <Highlight>{length}</Highlight> workers
      </ShowingSection>
      <PageSection>Pages: {buttons}</PageSection>
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