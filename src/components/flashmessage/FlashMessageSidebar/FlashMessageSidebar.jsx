import {
  Radio,
  FormControlLabel,
  RadioGroup
} from "@material-ui/core";
import {
  theme
} from "globals";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const SidebarWrapper = styled.div`
  background-color: white;
  box-shadow: 2px 0px 5px -2px #C0BFC0;
  display: flex;
  flex-direction: column;
`;

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-left: 5%;
`;


const TealRadio = withStyles({
  root: {
    color: theme.libertyDarkTeal,
    "&$checked": {
      color: theme.libertyDarkTeal
    }
  },
  checked: {}
})(props => <Radio color="default" {...props} />);


const FlashMessageSidebar = props => {
  const {
    flashMessageState,
    setFlashMessageState
  } = props;

  const skill = flashMessageState.skill;

  const handleRadioChange = selection => {
    setFlashMessageState({
      ...flashMessageState,
      skill: selection,
      fetching: true
    });
  };

  return (
    <SidebarWrapper>
      <RadioContainer>
        <RadioGroup name="skill" value={skill} onChange={event => handleRadioChange(event.target.value)}>
          <FormControlLabel control={<TealRadio
            value="aisgL1"
          />}
          label="aisgL1"
          value="aisgL1"/>
          <FormControlLabel control={<TealRadio
            value="aisgConsumer"/>}
          label="aisgConsumer"
          value="aisgConsumer"/>
          <FormControlLabel control={<TealRadio
            value="aisgEcliq"/>}
          label="aisgEcliq"
          value="aisgEcliq"/>
          <FormControlLabel control={<TealRadio
            value="aisgPassword"/>}
          label="aisgPassword"
          value="aisgPassword"/>
        </RadioGroup>
      </RadioContainer>
    </SidebarWrapper>
  );
};

FlashMessageSidebar.propTypes = {
  flashMessageState: PropTypes.object.isRequired,
  setFlashMessageState: PropTypes.func.isRequired
};

export default FlashMessageSidebar;