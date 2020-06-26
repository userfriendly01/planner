import { CustomInput } from "components";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const ModalExtension = props => {
  const {
    extension,
    updateValue
  } = props;

  return (
    <FlexColumn>
      <CustomInput
        maxLength="4"
        label="Extension"
        name="Extension"
        updateValue={updateValue}
        value={extension}
      />
    </FlexColumn>
  );
};

ModalExtension.propTypes = {
  extension: PropTypes.string.isRequired,
  updateValue: PropTypes.func.isRequired
};

export default ModalExtension;
