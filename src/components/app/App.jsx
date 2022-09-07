import {
  CircularProgress,
  Modal
} from "@mui/material";
import {
  Header,
  NavTabs,
  NotificationModal
} from "components";
import { useAdminDispatch } from "context";
import {
  apiPaths,
  theme,
  timeouts
} from "globals";
import React, {
  useEffect,
  useState
} from "react";
import {
  getManagers as getManagersServiceCall,
  getOffices as getOfficesServiceCall,
  getCalabrioUsers as getCalabrioUsersServiceCall,
  getCalabrioRoles as getCalabrioRolesServiceCall,
  getCalabrioOrg as getCalabrioOrgServiceCall
} from "services";
import styled from "styled-components";
import {
  wait,
  formatManagersResponse,
  formatOfficesResponse,
  formatWorkerResponse,
  isErrorIn400s,
  myAxios
} from "utils";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  font-size: 1.2rem;
  padding: 0.5rem 0;
`;

const ErrorPayload = styled.div`
  font-size: 0.9rem;
  padding: 0.5rem 0;
`;

const ErrorStatus = styled.div`
  font-size: 3.5rem;
  padding: 0.5rem 0;
`;

const ErrorWrapper = styled.div`
  padding: 10%;
`;

const Overlay = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
`;

const LoadingMessage = styled.div`
  font-size: 30px;
  padding-bottom: 32px;
`;

const success = "success";

const authenticate = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.AUTH)
  .then(res => {
    dispatch({
      type: "loadUserData",
      payload: {
        pingIdentity: res.data
      }
    });
    resolve(true);
  })
  .catch(error => {
    let msg = "An error occurred when trying to authenticate";
    if(error.response && isErrorIn400s(error.response.status)) {
      msg = "You are not authorized to view this page";
    }
    reject({
      msg,
      error
    });
  })
);

const getManagers = async dispatch => {
  try {
    const managers = await getManagersServiceCall();
    dispatch({
      type: "loadManagers",
      payload: formatManagersResponse(managers)
    });
  } catch (error) {
    throw ({
      msg: "Failed to fetch managers from service",
      error
    });
  }
};

const getOffices = async dispatch => {
  try {
    const offices = await getOfficesServiceCall();
    dispatch({
      type: "loadOffices",
      payload: formatOfficesResponse(offices)
    });
  } catch (error) {
    throw ({
      msg: "Failed to fetch offices from service",
      error
    });
  }
};

const getCalabrioUsers = async dispatch => {
  try {
    const agents = await getCalabrioUsersServiceCall();
    console.log("Calabrio Agents", agents.data);
    dispatch({
      type: "loadCalabrioUsers",
      payload: agents.data
    });
  } catch (error) {
    console.error("Failed to fetch calabrio org from service");
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getCalabrioOrg = async dispatch => {
  try {
    const org = await getCalabrioOrgServiceCall();
    console.log("Calabrio Org", org);
    dispatch({
      type: "loadCalabrioOrg",
      payload: org.data
    });
  } catch (error) {
    console.error("Failed to fetch calabrio org from service");
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getCalabrioRoles = async dispatch => {
  try {
    const roles = await getCalabrioRolesServiceCall();
    console.log("Calabrio Roles", roles);
    dispatch({
      type: "loadCalabrioRoles",
      payload: roles.data
    });
  } catch (error) {
    console.error("Failed to fetch calabrio Roles from service");
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getProfiles = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_PROFILES)
  .then(res => {
    dispatch({
      type: "loadProfiles",
      payload: res.data
    });
    resolve(true);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch profiles from service",
      error
    });
  })
);

const getSkills = dispatch => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_SKILLS)
  .then(res => {
    dispatch({
      type: "loadSkills",
      payload: res.data.consolidatedSkills
    });
    resolve(true);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch skills from service",
      error
    });
  })
);

const getWorkers = async dispatch => {
  try {
    const response = await myAxios.get(apiPaths.GET_WORKERS);

    // filter out workers with "inactiveInd": true or no attributes
    const filteredWorkers = formatWorkerResponse(response.data).filter(worker => !worker.inactiveInd && worker.attributes);
    dispatch(({
      type: "addWorkers",
      payload: filteredWorkers
    }));
  } catch (error) {
    throw ({
      msg: "Failed to fetch workers from service",
      error
    });
  }
};

const App = () => {

  const [loadResult, setLoadResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAdminDispatch();

  useEffect(() => {
    Promise.all([
      authenticate(dispatch),
      getManagers(dispatch),
      getOffices(dispatch),
      getProfiles(dispatch),
      getSkills(dispatch),
      getWorkers(dispatch),
      getCalabrioUsers(dispatch),
      getCalabrioOrg(dispatch),
      getCalabrioRoles(dispatch)
    ])
      .then(() => {
        setLoadResult(success);
      })
      .catch(err => {
        console.error(err.msg, { error: err.error });
        setLoadResult(err);
      });
  }, []);

  useEffect(() => {
    wait(() => setShowModal(true), timeouts.AUTH);
  }, []);

  if (loadResult) {
    if (loadResult === success) {
      return (
        <AppWrapper data-testid="app-wrapper">
          <Header/>
          <NavTabs/>
          <Modal onClose={() => { return; }} open={showModal === true}>
            <NotificationModal
              buttonText={"Reload"}
              handleClick={() => window.location.reload()}
              text={"Your session has expired. Please reload the page."}
            />
          </Modal>
        </AppWrapper>
      );
    } else {
      return (
        <Overlay data-testid="error-overlay">
          <ErrorWrapper>
            <ErrorStatus>{loadResult.error.response.status}</ErrorStatus>
            <ErrorMessage>{loadResult.msg}</ErrorMessage>
            <ErrorPayload>{JSON.stringify(loadResult.error.response.data)}</ErrorPayload>
          </ErrorWrapper>
        </Overlay>
      );
    }
  } else {
    return (
      <Overlay>
        <LoadingMessage>Loading...</LoadingMessage>
        <CircularProgress size={theme.circularProgressSize} />
      </Overlay>
    );
  }
};

export default App;