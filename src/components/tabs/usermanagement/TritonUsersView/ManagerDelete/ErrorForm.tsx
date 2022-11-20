import {
  ButtonWrapper,
  TextBox,
  PenaltyBox
} from "./ManagerDelete.Styles";
import {
  StyledButton
} from "components";
import {
  FlexColumn
} from "globals";
import React from "react";

export interface ErrorFormProps {
  TeamMembers: string,
  HandleClose: () => void
}

const ErrorForm = (props:ErrorFormProps) : any => {
  const {
    TeamMembers,
    HandleClose
  } = props;

  return (
    <div>
      <FlexColumn>
        <TextBox data-testid={"team-members-error-textbox"}>
          Sorry, this manager cannot be deleted until these team members are re-assigned:
        </TextBox>
        <PenaltyBox data-testid={"team-members-error-penaltybox"}>
          {TeamMembers}
        </PenaltyBox>
      </FlexColumn>
      <ButtonWrapper>
        <StyledButton onClick={HandleClose} data-testid={"delete-manager-button"}>
          Close
        </StyledButton>
      </ButtonWrapper>
    </div>
  );
};

export default ErrorForm;