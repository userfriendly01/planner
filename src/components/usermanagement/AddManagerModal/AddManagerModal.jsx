import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import {
  ButtonBase,
  // FormControl,
  // InputLabel,
  // OutlinedInput,
  Paper,
  // Select,
  TextField
} from "@material-ui/core";
// import { ProfilesContext } from "context";
import PropTypes from "prop-types";
import React /*, {
  useContext,
  useEffect,
  useState
}*/ from "react";
// import MaskedInput from "react-text-mask";
import styled/*, {
  keyframes
}*/ from "styled-components";
// import {
//   myAxios
// } from "utils";

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

const CustomButton = styled(ButtonBase)`
  && {
    opacity: ${props => props.disabled ? ".5" : "1"};
    background-color: #AAEDED;
    border: none;
    border-radius: 3px;
    color: #1A1446;
    cursor: pointer;
    font-size: 1.2em;
    outline: none;
    padding: 5 10 5 10;
  }
`;

// const CustomButtonWrapper = styled.div`
//   align-self: flex-start;
//   justify-self: flex-end;
//   margin-left: auto;
// `;

const Header = styled.div`
  align-self: center;
  color: #1A1446;
  font-family: 'Roboto', sans-serif;
  font-size: 3rem;
  font-weight: 400;
  letter-spacing: 0rem;
  line-height: 1.30357em;
  margin: 2%;
`;

const HeaderAndCloseButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalContainer = styled(FlexColumn)`
left: 50%;
padding: 2%;
position: absolute;
top: 50%;
transform: translate(-50%, -50%);
`;

const PaperContainer = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
`;

const TextInput = styled(TextField)`
  flex-grow: 1;
  && {
    margin: 2%;
  }
`;

const AddManagerModal = props => {
  const {
    handleClose
  } = props;

  const saveManager = () => {
    console.log("save it, put it in your pocket for later");
  };

  return (
    <ModalContainer>
      <PaperContainer>
        <HeaderAndCloseButtonWrapper>
          <div></div>
          <Header>Add a Manager</Header>
          {/* <CustomButtonWrapper> */}
          <CloseRoundedIcon onClick={handleClose} tooltip="Close Add Manager Modal"/> {/* TODO: tooltip & hover */}
          {/* </CustomButtonWrapper> */}
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <FlexRow>
            <TextInput
              label="Manager N Number"
              name="Manager N Number"
              // onChange={}
              margin="normal"
              variant="outlined"
              // value={form.nNumber}
            />
          </FlexRow>
        </FlexColumn>
        <ButtonWrapper>
          <CustomButton disabled={false} onClick={saveManager}>
            Add Manager
          </CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

AddManagerModal.propTypes = {
  handleClose: PropTypes.func
};

export default AddManagerModal;
