import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const Highlight = styled.span`
  color: #1A1446;
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1% 2% 1% 2%;
`;

const PageSection = styled.div`
  color: #C0BFC0;
  font-size: 1em;
`;

const ShowingSection = styled.div`
  color: #C0BFC0;
  font-size: .825em;
`;

const ManagementPagination = props => {
  const {
    buttons,
    end,
    length,
    start
  } = props;
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
  buttons: PropTypes.arrayOf(PropTypes.object),
  end: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired
};

export default ManagementPagination;