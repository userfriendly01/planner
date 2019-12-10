import { CircularProgress } from "@material-ui/core";
import {
  AddFlashMessage,
  FlashMessageSidebar,
  ViewFlashMessage
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
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

const ViewAddWrapper = styled.div`
  width: 100%;
`;

const FlashMessageContainer = () => {

  const dispatch = useAdminDispatch();
  const state = useAdminState();
  const [fetching, setFetching] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const toggleFetching = value => setFetching(value);
  const toggleReadOnly = () => setReadOnly(!readOnly);

  useEffect(() => {
    const req = { callflowId: 5 };
    myAxios.post(apiPaths.GET_FLASH_MESSAGE, req)
      .then(res => {
        const flashMessage = res.data;
        dispatch({
          type: "updateFlashMessage",
          payload: flashMessage
        });
        if (flashMessage.length > 0) {
          setReadOnly(true);
        }
        setFetching(false);
      })
      .catch(err => {
        console.error("Failed to fetch flash message from DB", err);
        setFetching(false);
      });
  }, []);

  return (
    <FlashMessageContainerWrapper>
      <FlashMessageSidebar />
      {fetching ?
        <LoadingContainer>
          <LoadingMessage>Loading...</LoadingMessage>
          <CircularProgress size={theme.circularProgressSize} />
        </LoadingContainer>
        : <ViewAddWrapper>
          {readOnly ?
            <ViewFlashMessage currentMessage={state.flashMessage} toggleFetching={toggleFetching} toggleReadOnly={toggleReadOnly} /> :
            <AddFlashMessage toggleFetching={toggleFetching} toggleReadOnly={toggleReadOnly} />}
        </ViewAddWrapper>}
    </FlashMessageContainerWrapper>
  );
};

export default FlashMessageContainer;