import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ClearButton = styled.button`
  background-color: #AAEDED;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Roboto',sans-serif;
  outline: none;
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const HelperTextSection = styled(FlexRow)`
  color: ${props => props.error ? "red" : "green"};
  font-family: 'Roboto', sans-serif;
  font-size: 0.8em;
  font-weight: 800;
  line-height: 1.2em;
  justify-content: space-between;
  margin: -1% 4% 2% 4%;
`;

const ModalHelperText = props => {
  const {
    clearUser,
    message,
    error
  } = props;

  return (
    <HelperTextSection error={error}>
      <div>{message}</div>
      <ClearButton onClick={clearUser}>X</ClearButton>
    </HelperTextSection>
  );
};

ModalHelperText.propTypes = {
  clearUser: PropTypes.func,
  error: PropTypes.bool,
  message: PropTypes.string
};

export default ModalHelperText;