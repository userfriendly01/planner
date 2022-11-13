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
      <ButtonWrapper>
        <StyledButton
          disabled={!SelectedManager}
          onClick={DeleteManagerClicked}
          data-testid={"delete-manager-button"}
        >
          Delete
        </StyledButton>
      </ButtonWrapper>
    </div>
  );
};

export default ConfirmationForm;
