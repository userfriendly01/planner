import {
  PaperContainer,
  StyledButton
} from "components";
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

interface NotificationModalProps {
  buttonText: string,
  handleClick: () => void,
  text: string
}

const NotificationModal = (props: NotificationModalProps) => {
  const {
    buttonText,
    handleClick,
    text
  } = props;

  return (
    <ModalContainer>
      <PaperContainer>
        <TextWrapper>
          <p>{text}</p>
        </TextWrapper>
        <ButtonWrapper>
          <StyledButton disabled={false} onClick={handleClick}>{buttonText}</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default NotificationModal;