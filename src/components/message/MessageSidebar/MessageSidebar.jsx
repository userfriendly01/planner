import { myAxios } from "utils";
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
  margin-left: -7px;
  margin-bottom: -7px;
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
  const profile = profileConfigs.PROFILE_SKILL_MAP.find(profile => profile.profileId === messageState.workerProfileId) || { skills: []};

  useEffect(() => {
    if (!messageState.skillData.allSkills && !messageState.skillData.fetchInProgress && messageState.skillData.retries) {
      myAxios.get(apiPaths.ALL_SKILLS)
        .then(result => {
          setMessageState({
            ...messageState,
            skillData: {
              ...messageState.skillData,
              allSkills: result.data.allSkills,
              fetchInProgress: false
            }
          });
        })
        .catch(err => {
          const fetchError = "Failed to fetch all skills: ";
          console.error(fetchError, err);
          setMessageState({
            ...messageState,
            skillData: {
              ...messageState.skillData,
              fetchInProgress: false,
              retries: messageState.skillData.retries - 1
            }
          });
        });

      setMessageState({
        ...messageState,
        skillData: {
          ...messageState.skillData,
          fetchInProgress: true,
          retries: messageState.skillData.retries - 1
        }
      });
    }
  });

  const handleRadioChange = selection => {
    setMessageState({
      ...messageState,
      skill: selection,
      fetching: true
    });
  };

  const makeRadioButton = skillName => {
    let hasFlash = false;
    if (messageState.skillData.allSkills) {
      const skill = messageState.skillData.allSkills.find(skill => skill.skillName === skillName);
      if (skill && skill.flashMessage) {
        hasFlash = true;
      }
    }

    if (hasFlash) {
      return (
        <div key={`${skillName}-div`}>
          <StyledFormControl
            key={`${skillName}-sc`}
            control={<TealRadio value={skillName} />}
            label={skillName}
          />
          <StyledBolt
            key={`${skillName}-bolt`}
            src={LighteningBolt}
            alt="*"
          />
        </div>
      );
    } else {
      return (
        <div key={`${skillName}-div`}>
          <StyledFormControl
            key={`${skillName}-sc`}
            control={<TealRadio value={skillName} />}
            label={skillName}
          />
        </div>
      );
    }
  };

  return (
    <SidebarWrapper>
      <RadioContainer>
        <RadioGroup
          name="skill"
          value={stateSkill}
          onChange={event => handleRadioChange(event.target.value)}
        >
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
  setMessageState: PropTypes.func.isRequired
};

export default MessageSidebar;