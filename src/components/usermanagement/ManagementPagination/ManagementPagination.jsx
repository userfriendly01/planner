import { Tooltip } from "@material-ui/core";
import {
  NavigateNextOutlined,
  NavigateBeforeOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined
} from "@material-ui/icons";
import { workersPerPage } from "globals";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const Highlight = styled.span`
  color: ${props => props.theme.textColor};
`;

const NavArrow = styled.span`
  border-radius: 50%;
  color: ${props => props.disabled ? props.theme.navArrow.disabledColor.disabledGrey : props.theme.textColor};
  display: inline-block;
  height: 25px;
  margin: 0 1px 0 1px;
  width: 25px;
  &:hover {
    background-color: ${props => props.theme.navArrow.hoverColor};
    cursor: pointer;
  }
`;

const NavArrowsWrapper = styled.div`
  color: #C0BFC0;
  font-size: 1em;
`;

const PaginationWrapper = styled.div`
  background-color: white;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1% 2% 1% 2%;
  position: sticky;
`;

const ShowingSection = styled.div`
  color: #C0BFC0;
  font-size: .825em;
`;

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

  const navArrowOnClick = pageNum => {
    console.log(`clicked navigate to page ${pageNum}`);
    setPage(pageNum);
  };

  console.log("current page =", page);
  console.log("onFirstPage:", onFirstPage);

  return (
    <PaginationWrapper>
      <ShowingSection>
        <Highlight>{start}</Highlight>-<Highlight>{end}</Highlight> of <Highlight>{length}</Highlight> workers
      </ShowingSection>
      <NavArrowsWrapper>
        <NavArrow disabled={onFirstPage}>
          <Tooltip title="First page">
            <SkipPreviousOutlined onClick={!onFirstPage ? () => navArrowOnClick(1) : null} key={"skipPrev"}/>
          </Tooltip>
        </NavArrow>
        <NavArrow disabled={onFirstPage}>
          <Tooltip title="Previous page">
            <NavigateBeforeOutlined onClick={!onFirstPage ? () => navArrowOnClick(page - 1) : null} key={"navBefore"}/>
          </Tooltip>
        </NavArrow>
        <NavArrow disabled={onLastPage}>
          <Tooltip title="Next page">
            <NavigateNextOutlined onClick={!onLastPage ? () => navArrowOnClick(page + 1) : null} key={"navNext"}/>
          </Tooltip>
        </NavArrow>
        <NavArrow disabled={onLastPage}>
          <Tooltip title="Last page">
            <SkipNextOutlined onClick={!onLastPage ? () => navArrowOnClick(numPages) : null} key={"skipNext"}/>
          </Tooltip>
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
