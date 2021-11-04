import { CircularProgress } from "@material-ui/core";
import {
  AddFlashMessage,
  FlashMessageSidebar,
  ViewFlashMessage
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

const FlashMessageContainerWrapper = styled.div`
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

const FlashMessageContainer = () => {

  const adminState = useAdminState();
  const nNumber = adminState.userContext.pingIdentity.sub;

  let loggedInWorker;
  adminState.workerContext.workers.forEach(worker =>{
    if(worker.attributes.n_number && worker.attributes.n_number.toLowerCase() === nNumber.toLowerCase()){
      loggedInWorker = worker;
    }
  });

  const workerProfileId = loggedInWorker ? loggedInWorker.attributes.profile_id : null;
  const profileArray = profileConfigs.PROFILE_SKILL_MAP.filter(profile => profile.profileId === workerProfileId);
  const defaultSkill = profileArray.length > 0 ? profileArray[0].skills[0] : null;
  const [flashMessageState, setFlashMessageState] = useState({
    fetching: true,
    flashMessage: "",
    skill: defaultSkill,
    readOnly: false,
    serviceCallError: null,
    workerProfileId: workerProfileId
  });
  useEffect(() => {
    myAxios.get(apiPaths.FLASH_MESSAGE + `/${flashMessageState.skill}`)
      .then(res => {
        const flashMessage = res.data.flashMessage;
        let readOnly = false;
        if (flashMessage.length > 0) {
          readOnly = true;
        }
        setFlashMessageState({
          ...flashMessageState,
          flashMessage,
          fetching: false,
          readOnly,
          serviceCallError: null
        });
      })
      .catch(err => {
        const fetchError = "Failed to fetch flash message. Please refresh this page or submit a request via";
        setFlashMessageState({
          ...flashMessageState,
          fetching: false,
          readOnly: true,
          serviceCallError: fetchError
        });
        console.error(fetchError, err);
      });
  }, [flashMessageState.skill]);

  return (
    profileArray.length > 0 ?
      <FlashMessageContainerWrapper>
        <FlashMessageSidebar flashMessageState={flashMessageState} setFlashMessageState={setFlashMessageState}/>
        {flashMessageState.fetching ?
          <LoadingContainer>
            <LoadingMessage>Loading...</LoadingMessage>
            <CircularProgress size={theme.circularProgressSize}/>
          </LoadingContainer>
          :
          <ViewAddWrapper>
            {flashMessageState.serviceCallError ?
              <ServiceCallError data-testid="service-call-error">{flashMessageState.serviceCallError}<StyledAnchor
                href="https://forge.lmig.com/issues/servicedesk/customer/portal/570/create/10636">Jira Service
                Desk</StyledAnchor></ServiceCallError> : null}
            {flashMessageState.readOnly ?
              <ViewFlashMessage flashMessageState={flashMessageState} setFlashMessageState={setFlashMessageState}/> :
              <AddFlashMessage flashMessageState={flashMessageState} setFlashMessageState={setFlashMessageState}/>}
          </ViewAddWrapper>}
      </FlashMessageContainerWrapper>
      :
      <FlashMessageContainerWrapper>
        <ServiceCallError data-testid="service-call-error">Your profile does not have access to self service flash messages.
          To request access, click the link and submit the provided form.<StyledAnchor
          href="https://forge.lmig.com/issues/servicedesk/customer/portal/570/create/10636">Jira Service
          Desk</StyledAnchor></ServiceCallError>
      </FlashMessageContainerWrapper>
  );
};

export default FlashMessageContainer;