import PropTypes from "prop-types";
import React from "react";
import styled, {
  keyframes
} from "styled-components";

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const FetchingRing = styled.div`
  display: inline-block;
  width: 64px;
  height: 64px;
  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #AAEDED;
    border-color: #AAEDED transparent #AAEDED transparent;
    animation: ${Spin} 1.2s linear infinite;
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const Overlay = styled(FlexRow)`
  align-items: center;
  background-color: ${props => props.modalBackground};
  border-radius: 4px;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 2em;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: .5;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
`;

const ModalOverlay = props => {
  const { status } = props;
  let modalBackground = "black";
  let loadingText = "Saving";
  if (status === "success") {
    modalBackground = "green";
    loadingText = "User Added Successfully";
  } else if (status === "fail") {
    modalBackground = "red";
    loadingText = "Failed To Add User";
  }
  return (
    <Overlay modalBackground={modalBackground} >
      {status === "saving" ? <FetchingRing /> : null }
      {loadingText}
    </Overlay>
  );
};

ModalOverlay.propTypes = {
  status: PropTypes.oneOf(["saving", "success", "fail"]).isRequired
};

export default ModalOverlay;