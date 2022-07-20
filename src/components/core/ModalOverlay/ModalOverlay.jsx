import {
  CloseRounded,
  Warning
} from "@material-ui/icons";
import { ModalFetchingRing } from "components";
import { modalOverlayStatuses } from "globals";
import PropTypes from "prop-types";
import React from "react";
import styled, { keyframes } from "styled-components";

const Dash = keyframes`
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const DashCheck = keyframes`
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}
`;

const Check = styled.polyline`
  stroke-dasharray: 1000;
  stroke-dashoffset: -100;
  animation: ${DashCheck} .9s .35s ease-in-out forwards;
`;

const Circle = styled.circle`
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
  animation: ${Dash} .9s ease-in-out;
`;

const CloseButtonDiv = styled.div`
  align-self: flex-end;
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const Icon = styled.svg`
  stroke-width: .2em;
  width: 3em;
`;

const IconAndMessageWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  padding: 16px;
`;

const InnerContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

const Line = styled.line`
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
  animation: ${Dash} .9s .35s ease-in-out forwards;
`;

const Overlay = styled(FlexRow)`
  align-items: center;
  background-color: ${props => props.modalBackground};
  border-radius: 4px;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 1.8em;
  height: 100%;
  justify-content: ${props => props.status === modalOverlayStatuses.FAIL ? "space-between" : "center"};
  opacity: .75;
  width: 100%;
  z-index: 100;
  left: 0;
  top: 0;
  position: absolute;
`;

const StyledCloseRounded = styled(CloseRounded)`
  cursor: pointer;
  && {
    font-size: 2rem;
    margin: .5rem;
  }
`;


const ModalOverlay = props => {
  const {
    message,
    handleClose,
    status
  } = props;

  const TextWrapper = styled.div`
  font-size: initial;
  margin-top: 5%;
  text-align: center;
  color: ${status === modalOverlayStatuses.PARTIAL_FAIL ? "black" : "white"}
`;

  const getIconAndBackground = status => {
    if (status === modalOverlayStatuses.SUCCESS) {
      return {
        background: "green",
        icon:
          <Icon version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <Circle fill="none" stroke="#FFFFFF" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <Check fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
          </Icon>
      };
    } else if (status === modalOverlayStatuses.PARTIAL_FAIL) {
      return {
        background: "goldenrod",
        icon: <Warning fontSize="large"/>
      };
    } else if (status === modalOverlayStatuses.FAIL) {
      return {
        background: "red",
        icon:
          <Icon version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <Circle fill="none" stroke="#FFFFFF" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <Line fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
            <Line fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
          </Icon>
      };
    } else { // status === "saving" or other
      return {
        background: "black",
        icon: <ModalFetchingRing />
      };
    }
  };

  const {
    background,
    icon
  } = getIconAndBackground(status);

  return (
    <Overlay
      modalBackground={background}
      status={status}
    >
      <InnerContainer>
        {
          (status === modalOverlayStatuses.FAIL) && handleClose
            ? <CloseButtonDiv>
              <StyledCloseRounded data-testid="close-button" onClick={handleClose} />
            </CloseButtonDiv>
            : null
        }
        <IconAndMessageWrapper>
          {icon}
          <TextWrapper>
            {message}
          </TextWrapper>
        </IconAndMessageWrapper>
      </InnerContainer>
    </Overlay>
  );
};

ModalOverlay.propTypes = {
  message: PropTypes.string.isRequired,
  handleClose: PropTypes.func,
  status: PropTypes.oneOf(Object.values(modalOverlayStatuses)).isRequired
};

export default ModalOverlay;