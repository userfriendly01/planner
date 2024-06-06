import {
  ManagerDeleteButtonWrapper,
  TextBox
} from "./ManagerDelete.Styles";
import { StyledButton } from "components/StyledButton";
import { FlexColumn } from "globals/interfaces";
import React from "react";

interface ConfirmationFormProps {
  SelectedManager: any,
  DeleteManagerClicked: () => void
}

export const ConfirmationForm = (props:ConfirmationFormProps) : any => {
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