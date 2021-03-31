import {
  FormControlLabel,
  Radio
} from "@material-ui/core";
import {
  FilterableSelect,
  ModalPhoneNumber
} from "components";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const EntryFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 220px;
  justify-content: space-evenly;
`;

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const LabelContainer = styled.div`
  text-align: center;
`;

const ForwardToEntryForm = props => {
  const {
    label,
    skills,
    workers,
    updateForwardTo
  } = props;

  const getWorkerOptions = () => {
    return workers.map(worker => {
      return {
        label: worker.attributes.full_name,
        value: worker.sid
      };
    });
  };

  const getSkillOptions = () => {
    return skills.map(skill => {
      return {
        label: skill.skill,
        value: skill.skill
      };
    });
  };

  const [ phoneNumber, setPhoneNumber ] = React.useState({
    isValid: false,
    value: "",
    showError: false
  });

  const handleUpdatePhoneNumber = (maskedValue, unmaskedValue, isValid) => {
    setPhoneNumber({
      ...phoneNumber,
      isValid,
      value: maskedValue
    });
    if(isValid) {
      updateForwardTo("+1" + unmaskedValue);
    } else {
      updateForwardTo(null);
    }
  };

  const [ forwardToType, updateForwardToType ] = React.useState("worker");

  const handleRadioChange = selection => {
    updateForwardTo(null);
    switch(selection) {
      case "skill":
        updateForwardToType("skill");
        break;
      case "phoneNum":
        updateForwardToType("phoneNum");
        break;
      default:
        updateForwardToType("worker");
    }
  };

  return (
    <EntryFormContainer>
      <LabelContainer>{label}</LabelContainer>
      <RadioContainer>
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType === "worker"}
              onChange={event => handleRadioChange(event.target.value)}
              value="worker"
            />}
          label="Person"
          labelPlacement="bottom"
        />
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType === "skill"}
              onChange={event => handleRadioChange(event.target.value)}
              value="skill"
            />}
          label="Skill"
          labelPlacement="bottom"
        />
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType === "phoneNum"}
              onChange={event => handleRadioChange(event.target.value)}
              value="phoneNum"
            />}
          label={<LabelContainer>External<br/>Number</LabelContainer>}
          labelPlacement="bottom"
        />
      </RadioContainer>
      {forwardToType === "worker" &&
        <FilterableSelect
          optionsList={getWorkerOptions()}
          updateValue={worker => updateForwardTo(worker.value)}
        />
      }
      {forwardToType === "skill" &&
        <FilterableSelect
          optionsList={getSkillOptions()}
          updateValue={skill => updateForwardTo(skill.value)}
        />
      }
      {forwardToType === "phoneNum" &&
        <ModalPhoneNumber
          allowSevenDigitVdn={false}
          id="forward-number-input"
          label="Forward To Number"
          number={phoneNumber.value}
          onBlur={() => {
            setPhoneNumber({
              ...phoneNumber,
              showError: true
            });
          }}
          showError={phoneNumber.showError}
          updateValue={handleUpdatePhoneNumber}
        />
      }
    </EntryFormContainer>
  );
};

ForwardToEntryForm.propTypes = {
  label: PropTypes.string.isRequired,
  updateForwardTo: PropTypes.func.isRequired,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      levels: PropTypes.array,
      levelSelected: PropTypes.number,
      skill: PropTypes.string
    })
  ).isRequired,
  workers: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: PropTypes.object,
      id: PropTypes.string,
      sid: PropTypes.string
    })
  )
};

export default ForwardToEntryForm;