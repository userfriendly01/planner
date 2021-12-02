import { CircularProgress } from "@material-ui/core";
import {
  AddClosedMessage,
  ClosedMessageSidebar,
  ViewClosedMessage
} from "components";
import {
  apiPaths,
  profileConfigs,
  theme
} from "globals";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import { myAxios } from "utils";
import { useAdminState } from "context";

const ClosedMessageContainerWrapper = styled.div`
  background-color: ${props => props.theme.tableRow.borderColor};
  display: flex;
  height: calc(100vh - 96px);
`;

const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1;
  flex-direction: column;
  justify-content: center;
  padding: 8px;
`;

const LoadingMessage = styled.div`
  font-size: 24px;
  padding-bottom: 32px;
`;

const ServiceCallError = styled.div`
  background-color: white;
  border: 2px solid ${props => props.theme.errorColor};
  border-radius: 10px;
  display: flex;
  height: fit-content;
  margin: 2vw;
  min-height: 10vh;
  padding: 10px;
  width: -webkit-fill-available;
`;

const StyledAnchor = styled.a`
  padding-left: 5px;
`;

const ViewAddWrapper = styled.div`
  width: 100%;
`;

const ClosedMessageContainer = () => {

  const adminState = useAdminState();
  const nNumber = adminState.userContext.pingIdentity.sub;

  let loggedInWorker;
  adminState.workerContext.workers.forEach(worker =>{
    if(worker.attributes.n_number && worker.attributes.n_number.toLowerCase() === nNumber.toLowerCase()){
      loggedInWorker = worker;
    }
  });

  const workerProfileId = loggedInWorker ? loggedInWorker.attributes.profile_id : null;
  const profile = profileConfigs.PROFILE_SKILL_MAP.find(profile => profile.profileId === workerProfileId);
  const defaultSkill = profile?.skills[0] || null;
  const [closedMessageState, setClosedMessageState] = useState({
    fetching: true,
    closedMessage: "",
    skill: defaultSkill,
    readOnly: false,
    serviceCallError: null,
    workerProfileId: workerProfileId
  });
  useEffect(() => {
    myAxios.get(apiPaths.CLOSED_MESSAGE + `/${closedMessageState.skill}`)
      .then(res => {
        const closedMessage = res.data.closedMessage;
        let readOnly = false;
        if (closedMessage.length > 0) {
          readOnly = true;
        }
        setClosedMessageState({
          ...closedMessageState,
          closedMessage,
          fetching: false,
          readOnly,
          serviceCallError: null
        });
      })
      .catch(err => {
        const fetchError = "Failed to fetch closed message. Please refresh this page or submit a request via";
        setClosedMessageState({
          ...closedMessageState,
          fetching: false,
          readOnly: true,
          serviceCallError: fetchError
        });
        console.error(fetchError, err);
      });
  }, [closedMessageState.skill]);

  return (
    profile ?
      <ClosedMessageContainerWrapper>
        <ClosedMessageSidebar closedMessageState={closedMessageState} setClosedMessageState={setClosedMessageState}/>
        {closedMessageState.fetching ?
          <LoadingContainer>
            <LoadingMessage>Loading...</LoadingMessage>
            <CircularProgress size={theme.circularProgressSize}/>
          </LoadingContainer>
          :
          <ViewAddWrapper>
            {closedMessageState.serviceCallError ?
              <ServiceCallError data-testid="service-call-error">{closedMessageState.serviceCallError}<StyledAnchor
                href="https://forge.lmig.com/issues/servicedesk/customer/portal/570/create/10636">Jira Service
                Desk</StyledAnchor></ServiceCallError> : null}
            {closedMessageState.readOnly ?
              <ViewClosedMessage closedMessageState={closedMessageState} setClosedMessageState={setClosedMessageState}/> :
              <AddClosedMessage closedMessageState={closedMessageState} setClosedMessageState={setClosedMessageState}/>}
          </ViewAddWrapper>}
      </ClosedMessageContainerWrapper>
      :
      <ClosedMessageContainerWrapper>
        <ServiceCallError data-testid="service-call-error">Your profile does not have access to self service closed messages.
          To request access, click the link and submit the provided form.<StyledAnchor
          href="https://forge.lmig.com/issues/servicedesk/customer/portal/570/create/10636">Jira Service
          Desk</StyledAnchor></ServiceCallError>
      </ClosedMessageContainerWrapper>
  );
};

export default ClosedMessageContainer;