import {
  Radio,
  FormControlLabel,
  RadioGroup
} from "@material-ui/core";
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
`;

const FlashMessageSidebar = props => {
  const {
    flashMessageState,
    setFlashMessageState
  } = props;

  const skill = flashMessageState.skill;

  const handleRadioChange = selection => {
    console.log("selection is:" + selection);
    setFlashMessageState({
      ...flashMessageState,
      skill: null
    });
    switch(selection) {
      case "aisgL1":
        setFlashMessageState({
          ...flashMessageState,
          skill: "aisgL1",
          fetching: true
        });
        break;
      case "aisgConsumer":
        setFlashMessageState({
          ...flashMessageState,
          skill: "aisgConsumer",
          fetching: true
        });
        break;
      case "aisgEcliq":
        setFlashMessageState({
          ...flashMessageState,
          skill: "aisgEcliq",
          fetching: true
        });
        break;
      case "aisgPassword":
        setFlashMessageState({
          ...flashMessageState,
          skill: "aisgPassword",
          fetching: true
        });
        break;
      default:
        setFlashMessageState({
          ...flashMessageState,
          skill: "aisgL1",
          fetching: true
        });
    }
    //trigger right pane to update
  };

  return (
    <SidebarWrapper>
      <RadioContainer>
        <RadioGroup name="skill" value={skill} onChange={event => handleRadioChange(event.target.value)}>
          <FormControlLabel control={<Radio
            value="aisgL1"
          />}
          label="aisgL1"
          value="aisgL1"/>
          <FormControlLabel control={<Radio
            value="aisgConsumer"/>}
          label="aisgConsumer"
          value="aisgConsumer"/>
          <FormControlLabel control={<Radio
            value="aisgEcliq"/>}
          label="aisgEcliq"
          value="aisgEcliq"/>
          <FormControlLabel control={<Radio
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