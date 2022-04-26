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
import React, { useEffect, useState } from "react";
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

  const stateSkill = messageState.skill;
  const profile = profileConfigs.PROFILE_SKILL_MAP.find(profile => profile.profileId === messageState.workerProfileId);

  const [ localState, setLocalState ] = useState({
    nextSkillIdx: 0,
    skillList: profile.skills.map(
      skill => {
        return {
          skillId: skill,
          isFetched: false,
          hasFlashMessage: false
        };
      }
    )
  });

  let apiPath;
  let dataField;
  if(messageType === "closed"){
    apiPath = apiPaths.CLOSED_MESSAGE;
    dataField = "closedMessage";
  } else {
    apiPath = apiPaths.FLASH_MESSAGE;
    dataField = "flashMessage";
  }

  useEffect(() => {
    console.log("wsx localState.skillList.length: ", localState.skillList.length);
    if (localState.skillList.length > 0) {
      if (localState.nextSkillIdx < 3) { //localState.skillList.length) {
        console.log("wsx api call for ", localState.skillList[localState.nextSkillIdx].skillId);
        Axios.get(apiPath + `/${localState.skillList[localState.nextSkillIdx].skillId}`)
          .then(result => {
            console.log("wsx Result: ", result);
            const message = result.data[dataField];
            let readOnly = false;
            if (message.length > 0) {
              readOnly = true;
            }
            setLocalState({
              ...localState,
              nextSkillIdx: localState.nextSkillIdx + 1
            });
          })
          .catch(err => {
            const fetchError = "wsx Failed to fetch message. ";
            console.error(fetchError, err);
            setLocalState({
              ...localState,
              nextSkillIdx: localState.nextSkillIdx + 1
            });
          });
      }
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