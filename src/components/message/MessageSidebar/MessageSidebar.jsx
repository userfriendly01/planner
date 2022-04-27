import Axios from "axios";
import {
  Radio,
  FormControlLabel,
  RadioGroup
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  theme,
  profileConfigs,
  apiPaths
} from "globals";
import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import LighteningBolt from "icons/LighteningBolt-06.png";

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
  vertical-align: bottom;
`;

const StyledBolt = styled.img`
  max-height: 22px;
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
    setMessageState,
    messageType
  } = props;

  let allSkills = null;
  let retries = 3;

  const stateSkill = messageState.skill;
  const profile = profileConfigs.PROFILE_SKILL_MAP.find(profile => profile.profileId === messageState.workerProfileId);

  useEffect(() => {
    if (!allSkills && retries) {
      retries -= 1;
      const path = apiPaths.ALL_SKILLS;
      console.log("wsx api call for skills & messages to: ", path);
      Axios.get(path)
        .then(result => {
          allSkills = result;
          console.log("wsx allSkills: ", allSkills);
        })
        .catch(err => {
          const fetchError = "wsx Failed to fetch all skills: ";
          console.error(fetchError, err);
        });
    }
  });

  const handleOnChange = selection => {
    setMessageState({
      ...messageState,
      skill: selection,
      fetching: true
    });
  };

  const makeRadioButton = skill => {
    return (
      <div>
        <StyledFormControl
          key={skill}
          control={<TealRadio value={skill} />}
          label={skill}
        />
        <StyledBolt src={LighteningBolt} alt="*"/>
      </div>
    );
  };

  return (
    <SidebarWrapper>
      <RadioContainer>
        <RadioGroup name="skill" value={stateSkill} onChange={event => handleOnChange(event.target.value)}>
          {profile.skills.map(function(skill) {
            return makeRadioButton(skill);
          })}
        </RadioGroup>
      </RadioContainer>
    </SidebarWrapper>
  );
};

MessageSidebar.propTypes = {
  messageState: PropTypes.object.isRequired,
  setMessageState: PropTypes.func.isRequired,
  messageType: PropTypes.string.isRequired
};

export default MessageSidebar;