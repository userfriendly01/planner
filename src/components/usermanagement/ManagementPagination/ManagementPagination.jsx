import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const Highlight = styled.span`
  color: #1A1446;
`;

const PageSection = styled.div`
  color: #C0BFC0;
  font-size: 1em;
`;

const PageButton = styled.button`
  background-color: ${props => props.value !== props.pageSelected ? "transparent" : "#1A1446"};
  border: ${props => props.value !== props.pageSelected ? "#C0BFC0" : "#1A1446"};
  border-radius: 5px;
  border-style: solid;
  border-width: 2px;
  color: #C0BFC0;
  cursor: pointer;
  margin: 0 2 0 2;
  outline: none;
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1% 2% 1% 2%;
`;

const ShowingSection = styled.div`
  color: #C0BFC0;
  font-size: .825em;
`;

const workersPerPage = 10;

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
  page: PropTypes.number,
  setPage: PropTypes.func.isRequired,
  start: PropTypes.number.isRequired
};

export default ManagementPagination;