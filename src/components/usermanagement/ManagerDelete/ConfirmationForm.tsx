import {
  ButtonWrapper,
  TextBox
} from "./ManagerDelete.Styles";
import {
  StyledButton
} from "components";
import {
  FlexColumn
} from "globals";
import React from "react";

export interface ConfirmationFormProps {
  selectedManager: any,
  deleteManagerClicked: () => void
}

const ConfirmationForm = (props:ConfirmationFormProps) : any => {
  const {
    selectedManager,
    deleteManagerClicked
  } = props;

  return (
    <div>
      <FlexColumn>
        <TextBox data-testid={"delete-confirmation-textbox"}>
          Are you sure you want to delete this manager?
        </TextBox>
      </FlexColumn>
      <ButtonWrapper>
        <StyledButton
          disabled={!selectedManager}
          onClick={deleteManagerClicked}
          data-testid={"delete-manager-button"}
        >
          Delete
        </StyledButton>
      </ButtonWrapper>
    </div>
  );
};

export default ConfirmationForm;
