import { CircularProgress } from "@material-ui/core";
import {
  AddMessage,
  MessageSidebar,
  ViewMessage
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
import PropTypes from "prop-types";

const MessageContainerWrapper = styled.div`
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

const MessageContainer = props => {
  const {
    value
  } = props;

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
  const [messageState, setMessageState] = useState({
    fetching: true,
    message: "",
    messageType: value,
    skill: defaultSkill,
    readOnly: false,
    serviceCallError: null,
    workerProfileId: workerProfileId
  });
  useEffect(() => {
    let apiPath;
    let dataField;
    if(value === "closed"){
      apiPath = apiPaths.CLOSED_MESSAGE;
      dataField = "closedMessage";
    } else {
      apiPath = apiPaths.FLASH_MESSAGE;
      dataField = "flashMessage";
    }
    myAxios.get(apiPath + `/${messageState.skill}`)
      .then(res => {
        const message = res.data[dataField];//will this work?
        let readOnly = false;
        if (message.length > 0) {
          readOnly = true;
        }
        setMessageState({
          ...messageState,
          message,
          fetching: false,
          readOnly,
          serviceCallError: null
        });
      })
      .catch(err => {
        const fetchError = "Failed to fetch closed message. Please refresh this page or submit a request via";
        setMessageState({
          ...messageState,
          fetching: false,
          readOnly: true,
          serviceCallError: fetchError
        });
        console.error(fetchError, err);
      });
  }, [messageState.skill]);

  return (
    profile ?
      <MessageContainerWrapper>
        <MessageSidebar messageState={messageState} setMessageState={setMessageState}/>
        {messageState.fetching ?
          <LoadingContainer>
            <LoadingMessage>Loading...</LoadingMessage>
            <CircularProgress size={theme.circularProgressSize}/>
          </LoadingContainer>
          :
          <ViewAddWrapper>
            {messageState.serviceCallError ?
              <ServiceCallError data-testid="service-call-error">{messageState.serviceCallError}<StyledAnchor
                href="https://forge.lmig.com/issues/servicedesk/customer/portal/570/create/10636">Jira Service
                Desk</StyledAnchor></ServiceCallError> : null}
            {messageState.readOnly ?
              <ViewMessage messageState={messageState} setMessageState={setMessageState}/> :
              <AddMessage messageState={messageState} setMessageState={setMessageState}/>}
          </ViewAddWrapper>}
      </MessageContainerWrapper>
      :
      <MessageContainerWrapper>
        <ServiceCallError data-testid="service-call-error">Your profile does not have access to self service messages.
          To request access, click the link and submit the provided form.<StyledAnchor
          href="https://forge.lmig.com/issues/servicedesk/customer/portal/570/create/10636">Jira Service
            Desk</StyledAnchor></ServiceCallError>
      </MessageContainerWrapper>
  );
};

MessageContainer.propTypes = {
  value: PropTypes.string.isRequired
};

export default MessageContainer;