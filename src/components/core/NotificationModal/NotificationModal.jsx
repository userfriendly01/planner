import {
  PaperContainer,
  StyledButton
} from "components";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const TextWrapper = styled.div`
  align-self: center;
`;

const NotificationModal = props => {
  const { reloadFn } = props;

  return (
    <ModalContainer>
      <PaperContainer>
        <TextWrapper>
          <p>Your session has expired. Please reload the page.</p>
        </TextWrapper>
        <ButtonWrapper>
          <StyledButton disabled={false} onClick={reloadFn}>Reload</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

NotificationModal.propTypes = {
  reloadFn: PropTypes.func.isRequired
};

export default NotificationModal;
