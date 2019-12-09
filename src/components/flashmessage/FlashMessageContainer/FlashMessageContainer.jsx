import {
  AddFlashMessage,
  FlashMessageSidebar,
  ViewFlashMessage
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import { apiPaths } from "globals";
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

const FlashMessageContainer = () => {

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const [readOnly, setReadOnly] = useState(false);
  const toggleReadOnly = () => setReadOnly(!readOnly);

  useEffect(() => {
    const req = { callflowId: 5 };
    myAxios.post(apiPaths.GET_FLASH_MESSAGE, req)
      .then(res => {
        dispatch({
          type: "updateFlashMessage",
          payload: res.data
        });
        setReadOnly(true);
      })
      .catch(err => console.error("Failed to fetch flash message from DB", err));
  }, []);

  return (
    <FlashMessageContainerWrapper>
      <FlashMessageSidebar />
      {readOnly ?
        <ViewFlashMessage currentMessage={state.flashMessage} toggleReadOnly={toggleReadOnly} /> :
        <AddFlashMessage toggleReadOnly={toggleReadOnly} />}
    </FlashMessageContainerWrapper>
  );
};

export default FlashMessageContainer;