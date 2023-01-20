import {
  ManagerDeleteButtonWrapper,
  TextBox
} from "./";
import {
  StyledButton
} from "components";
import {
  FlexColumn
} from "globals";
import React from "react";

export interface ConfirmationFormProps {
  SelectedManager: any,
  DeleteManagerClicked: () => void
}

const ConfirmationForm = (props:ConfirmationFormProps) : any => {
  const {
    SelectedManager,
    DeleteManagerClicked
  } = props;

  return (
    <div>
      <FlexColumn>
        <TextBox data-testid={"delete-confirmation-textbox"}>
          Are you sure you want to delete this manager?
        </TextBox>
      </FlexColumn>
      <ManagerDeleteButtonWrapper>
        <StyledButton
          disabled={!SelectedManager}
          onClick={DeleteManagerClicked}
          data-testid={"delete-manager-button"}
        >
          Delete
        </StyledButton>
      </ManagerDeleteButtonWrapper>
    </div>
  );
};

export default ConfirmationForm;
