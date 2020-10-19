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

const HeaderAndCloseButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftDiv = styled.div`
  width: 1em;
`;

const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const NotificationModal = props => {
  const { reloadApp } = props;

  return (
    <ModalContainer>
      <PaperContainer>
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
        </HeaderAndCloseButtonWrapper>
        <p>Your session has expired. Please reload the page</p>
        <ButtonWrapper>
          <StyledButton disabled={false} onClick={reloadApp}>Reload</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

NotificationModal.propTypes = {
  reloadApp: PropTypes.func.isRequired
};

export default NotificationModal;
