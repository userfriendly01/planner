import {
  CircularProgress,
  Paper
} from "@material-ui/core";
import axios from "axios";
import { ManagementTable } from "components";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import { formatWorkerResponse } from "utils";

const Highlight = styled.span`
  color: #1A1446;
`;

const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2%;
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1% 2% 1% 2%;
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

const PageSection = styled.div`
  color: #C0BFC0;
  font-size: 1em;
`;

const ShowingSection = styled.div`
  color: #C0BFC0;
  font-size: .825em;
`;

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const workersPerPage = 10;

const ManagementWrapper = props => {
  const { profileId } = props;
  const [workers, setWorkers] = useState([]);
  const [workersStart, setWorkersStart] = useState(1);
  const [workersEnd, setWorkersEnd] = useState(workersPerPage);
  const [pageSelected, setPageSelected] = useState(1);

  useEffect(() => {
    axios.get(apiPaths.GET_WORKERS_BY_PROFILEID(profileId))
      .then(res => {
        setWorkers(formatWorkerResponse(res.data));
      })
      .catch(err => console.error("An unknown error has occurred.", err));
  }, []);

  useEffect(() => {
    if (pageSelected * workersPerPage > workers.length) {
      setWorkersEnd((((pageSelected - 1) * workersPerPage) + (workers.length % workersPerPage)));
    } else {
      setWorkersEnd(pageSelected * workersPerPage);
    }
    setWorkersStart(((pageSelected - 1) * workersPerPage) + 1);
  }, [workers, pageSelected]);

  const buttons = [];
  const numWorkers = workers.length;
  const numPages = Math.ceil(numWorkers / workersPerPage);

  for (let i = 0; i < numPages; i++) {
    const page = i + 1;
    buttons.push(<PageButton key={i} value={page} pageSelected={pageSelected} onClick={() => setPageSelected(page)}>{page}</PageButton>);
  }

  return (
    <ManagementContainer>
      <StyledPaper elevation={3}>
        {
          workers.length !== 0 ? (
            <ManagementTable workers={workers.slice((workersStart - 1), workersEnd)} ></ManagementTable>
          ) : <CircularProgress size={60} />
        }
      </StyledPaper>
      {
        workers.length !== 0 ?
          <PaginationWrapper>
            <ShowingSection>
              Showing <Highlight>{workersStart}</Highlight> to <Highlight>{workersEnd}</Highlight> of <Highlight>{workers.length}</Highlight> workers
            </ShowingSection>
            <PageSection>
              Pages: {buttons}
            </PageSection>
          </PaginationWrapper> : null
      }
    </ManagementContainer>
  );
};

ManagementWrapper.propTypes = {
  profileId: PropTypes.number.isRequired
};

export default ManagementWrapper;