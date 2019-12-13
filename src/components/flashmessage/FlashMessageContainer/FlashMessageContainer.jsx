import { CircularProgress } from "@material-ui/core";
import {
  AddFlashMessage,
  FlashMessageSidebar,
  ViewFlashMessage
} from "components";
import {
  apiPaths,
  theme
} from "globals";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import { myAxios } from "utils";

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

  const [flashMessageState, setFlashMessageState] = useState({
    fetching: true,
    flashMessage: "",
    readOnly: false,
    serviceCallError: null
  });

  useEffect(() => {
    const callFlowId = 5;
    myAxios.get(apiPaths.FLASH_MESSAGE + `/${callFlowId}`)
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
          readOnly
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
  }, []);

  return (
    <FlashMessageContainerWrapper>
      <FlashMessageSidebar />
      {flashMessageState.fetching ?
        <LoadingContainer>
          <LoadingMessage>Loading...</LoadingMessage>
          <CircularProgress size={theme.circularProgressSize} />
        </LoadingContainer>
        :
        <ViewAddWrapper>
          {flashMessageState.serviceCallError ?
            <ServiceCallError data-testid="service-call-error">{flashMessageState.serviceCallError}<StyledAnchor href="https://forge.lmig.com/issues/servicedesk/customer/portal/570/create/10636">Jira Service Desk</StyledAnchor></ServiceCallError> : null}
          {flashMessageState.readOnly ?
            <ViewFlashMessage flashMessageState={flashMessageState} setFlashMessageState={setFlashMessageState} /> :
            <AddFlashMessage flashMessageState={flashMessageState} setFlashMessageState={setFlashMessageState} />}
        </ViewAddWrapper>}
    </FlashMessageContainerWrapper>
  );
};

export default FlashMessageContainer;