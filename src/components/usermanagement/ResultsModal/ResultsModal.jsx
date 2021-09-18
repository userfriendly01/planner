import {
  PaperContainer,
  StyledButton
} from "components";
import {
  resetResponses,
  theme
} from "globals";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin: 5px;
`;

const FlexRow = styled.div`
  display: flex;
  padding: 5px;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const FlexRowMax = styled(FlexRow)`
  width: max-content;
`;

const Header = styled.h1`
  align-self: center;
`;

const ModalContainer = styled(FlexColumn)`
  font-family: 'Roboto', sans-serif;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ResultsContainer = styled(FlexColumn)`
  background-color: ${props => props.backgroundColor};
  border-width: 2px;
  border-color: ${props => props.borderColor};
  border-style: solid;
  border-radius: 10px;
  padding: 5px;
  width: auto;
`;

const ResultsModal = props => {
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
          <ButtonWrapper>
            <StyledButton onClick={handleClose}>OK</StyledButton>
          </ButtonWrapper>
        </PaperContainer>
      </ModalContainer>
    );
  }

  const warnOnWorkers = [];
  const failOnWorkers = [];
  unsuccessfulWorkers.forEach((worker, index) => {
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
        <ButtonWrapper>
          <StyledButton onClick={handleClose}>OK</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

ResultsModal.propTypes = {
  error: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  successfulWorkers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ).isRequired,
  unsuccessfulWorkers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      reason: PropTypes.string
    })
  ).isRequired
};

export default ResultsModal;