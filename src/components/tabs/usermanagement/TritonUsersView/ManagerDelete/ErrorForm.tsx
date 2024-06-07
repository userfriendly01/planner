import {
  ManagerDeleteButtonWrapper,
  TextBox,
  PenaltyBox
} from "usermanagement/ManagerDelete.Styles";
import { StyledButton } from "components/StyledButton";
import { FlexColumn } from "globals/interfaces";
import React from "react";

interface ErrorFormProps {
  TeamMembers: string,
  HandleClose: () => void
}

export const ErrorForm = (props: ErrorFormProps) : any => {
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
      <ManagerDeleteButtonWrapper>
        <StyledButton onClick={HandleClose} data-testid={"delete-manager-button"}>
          Close
        </StyledButton>
      </ManagerDeleteButtonWrapper>
    </div>
  );
};