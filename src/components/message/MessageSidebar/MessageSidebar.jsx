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
  overflow-y: scroll;
  min-width: 20%;
  overflow-x: hidden;
`;

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-left: 5%;
`;

const StyledFormControl = styled(FormControlLabel)`
  max-width: 90%;
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

const MessageSidebar = props => {
  const {
    messageState,
    setMessageState
  } = props;

  const stateSkill = messageState.skill;
  const profile = profileConfigs.PROFILE_SKILL_MAP.find(profile => profile.profileId === messageState.workerProfileId) || { skills: [] };

  const handleRadioChange = selection => {
    setMessageState({
      ...messageState,
      skill: selection,
      fetching: true
    });
  };
  return (
    <SidebarWrapper>
      <RadioContainer>
        <RadioGroup name="skill" value={stateSkill} onChange={event => handleRadioChange(event.target.value)}>
          {profile.skills.map(function(skill) {
            return <StyledFormControl key={skill} control={<TealRadio
              value={skill}/>}
            label={skill}/>;
          })}
        </RadioGroup>
      </RadioContainer>
    </SidebarWrapper>
  );
};

MessageSidebar.propTypes = {
  messageState: PropTypes.object.isRequired,
  setMessageState: PropTypes.func.isRequired
};

export default MessageSidebar;