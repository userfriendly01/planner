import {
  ResetSkillsButtonWrapper,
  FlexRowMax,
  Header,
  ModalContainer,
  ResultsContainer
} from "usermanagement/ResetSkills.Styles";
import { ResultsModalProps } from "./ResetSkills.Interfaces";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import { resetResponses } from "globals";
import { theme } from "globals/theme";
import React from "react";

export const ResetSkillsResultsModal = (props: ResultsModalProps) => {
  const {
    error,
    handleClose,
    successfulWorkers,
    unsuccessfulWorkers
  } = props;

  if (error) {
    return (
      <ModalContainer>
        <PaperContainer>
          <Header>Reset Results</Header>
          <ResultsContainer backgroundColor={theme.resultsModal.fadedError} borderColor={theme.errorColor} data-testid="failureContainer">
            {error}
          </ResultsContainer>
          <ResetSkillsButtonWrapper>
            <StyledButton onClick={handleClose}>OK</StyledButton>
          </ResetSkillsButtonWrapper>
        </PaperContainer>
      </ModalContainer>
    );
  }

  const warnOnWorkers: any[] = [];
  const failOnWorkers: any[] = [];
  unsuccessfulWorkers.forEach((worker: any, index: number) => {
    const display =
      <FlexRowMax key={index}>
        <b>{worker.name}</b> &nbsp;was not updated: [{worker.reason}]
      </FlexRowMax>;

    if (worker.reason === resetResponses.SKILLS_WERE_EQUAL) {
      warnOnWorkers.push(display);
    } else {
      failOnWorkers.push(display);
    }
  });

  return (
    <ModalContainer>
      <PaperContainer>
        <Header>Reset Results</Header>
        {
          successfulWorkers.length !== 0 ?
            <ResultsContainer backgroundColor={theme.resultsModal.fadedSuccess} borderColor={theme.successColor} data-testid="successContainer">
              <FlexRowMax>{successfulWorkers.length} worker(s) reset successfully</FlexRowMax>
            </ResultsContainer> :
            null
        }
        {
          warnOnWorkers.length !== 0 ?
            <ResultsContainer backgroundColor={theme.resultsModal.fadedWarning} borderColor={theme.warningColor} data-testid="warningContainer">{warnOnWorkers}</ResultsContainer> :
            null
        }
        {
          failOnWorkers.length !== 0 ?
            <ResultsContainer backgroundColor={theme.resultsModal.fadedError} borderColor={theme.errorColor} data-testid="failureContainer">{failOnWorkers}</ResultsContainer> :
            null
        }
        <ResetSkillsButtonWrapper>
          <StyledButton onClick={handleClose}>OK</StyledButton>
        </ResetSkillsButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};