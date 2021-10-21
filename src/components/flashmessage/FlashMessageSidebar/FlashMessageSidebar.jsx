import {
  Radio,
  FormControlLabel,
  RadioGroup
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  theme,
  profileConfigs
} from "globals";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

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

  const stateSkill = flashMessageState.skill;
  //This is the matching profile from the constant that matched the workers profile ID
  const profile = profileConfigs.PROFILE_SKILL_MAP.filter(profile => profile.profileId === flashMessageState.workerProfileId)[0];
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
        <RadioGroup name="skill" value={stateSkill} onChange={event => handleRadioChange(event.target.value)}>
          !-- loop through the profile.skills to add a button for each skill
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