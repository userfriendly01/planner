import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ClearButton = styled.button`
  display: flex;
  background-color: #AAEDED;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Roboto',sans-serif;
  outline: none;
  height: 30px;
  width: 20px;
  align-items: center;
  justify-content: center;
`;

const HelperTextSection = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.error ? "red" : "green"};
  font-family: 'Roboto', sans-serif;
  font-size: 0.8em;
  font-weight: 800;
  line-height: .2em;
  justify-content: space-between;
  height: 30px;
`;

const Text = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
`;

export const ModalHelperText = props => {
  const {
    clearFunction,
    message,
    error
  } = props;

  return (
    <HelperTextSection data-testid="helper-text-section" error={error}>
      <Text>{message}</Text>
      <ClearButton onClick={clearFunction}>X</ClearButton>
    </HelperTextSection>
  );
};

ModalHelperText.propTypes = {
  clearFunction: PropTypes.func,
  error: PropTypes.bool,
  message: PropTypes.string
};