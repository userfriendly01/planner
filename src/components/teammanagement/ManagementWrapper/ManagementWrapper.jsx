import {
  CircularProgress,
  Paper
} from "@material-ui/core";
import axios from "axios";
import { ManagementTable } from "components";
import { apiPaths } from "constants";
import PropTypes from "prop-types";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import { formatWorkerResponse } from "utils";

const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2%;
`;

const StyledPaper = styled(Paper)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const ManagementWrapper = props => {
  const { profileId } = props;
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    axios.get(apiPaths.GET_WORKERS_BY_PROFILEID(profileId))
      .then(res => {
        setWorkers(formatWorkerResponse(res.data));
      })
      .catch(err => console.error("An unknown error has occurred.", err));
  }, []);

  return (
    <ManagementContainer>
      <StyledPaper>
        {
          workers.length !== 0 ? <ManagementTable workers={workers} ></ManagementTable> : <CircularProgress size={60} />
        }
      </StyledPaper>
    </ManagementContainer>
  );
};

ManagementWrapper.propTypes = {
  profileId: PropTypes.number.isRequired
};

export default ManagementWrapper;