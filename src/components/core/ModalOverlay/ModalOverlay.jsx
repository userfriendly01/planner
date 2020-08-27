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

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
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
  justify-content: center;
  left: 0;
  opacity: .75;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
`;

const Icon = styled.svg`
  stroke-width: .2em;
  width: 4em;
`;

const InnerContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5%;
`;

const TextWrapper = styled.div`
  margin-top: 5%;
  text-align: center;
`;

const ModalOverlay = props => {
  const {
    status,
    message
  } = props;

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
    <Overlay modalBackground={background} >
      <InnerContainer>
        {icon}
        <TextWrapper>
          {message}
        </TextWrapper>
      </InnerContainer>
    </Overlay>
  );
};

ModalOverlay.propTypes = {
  message: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(modalOverlayStatuses)).isRequired
};

export default ModalOverlay;