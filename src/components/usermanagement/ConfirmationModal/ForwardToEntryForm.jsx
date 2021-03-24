import {
  FilterableSelect,
  ModalPhoneNumber
} from "components";
import {
  FormControlLabel,
  Radio
} from "@material-ui/core";
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
  display: flex;
  text-align: center;
`;

const ForwardToEntryForm = props => {
  const {
    skills,
    workers,
    updateForwardTo
  } = props;

  const getWorkerOptions = () => {
    const workerOptions = [];
    workers.map(worker => {
      workerOptions.push({
        label: worker.attributes.full_name,
        value: worker.sid
      });
    });
    return workerOptions;
  };

  const getSkillOptions = () => {
    const skillOptions = [];
    skills.map(skill => {
      skillOptions.push({
        label: skill.skill,
        value: skill.skill
      });
    });
    return skillOptions;
  };

  const [ phoneNumber, setPhoneNumber ] = React.useState({
    isValid: false,
    value: "",
    showError: false
  });

  const [ forwardToType, updateForwardToType ] = React.useState("worker");

  const handleChange = selection => {
    updateForwardTo(null);
    switch(selection) {
      case "skill":
        updateForwardToType("skill");
        break;
      case "number":
        updateForwardToType("number");
        break;
      default:
        updateForwardToType("worker");
    }
  };

  return (
    <EntryFormContainer>
      <LabelContainer>This user has a direct dial number. <br/> Please choose a forward to option before confirming.</LabelContainer>
      <RadioContainer>
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType === "worker"}
              onChange={event => handleChange(event.target.value)}
              value="worker"
            />}
          label="Person"
          labelPlacement="bottom"
        />
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType === "skill"}
              onChange={event => handleChange(event.target.value)}
              value="skill"
            />}
          label="Skill"
          labelPlacement="bottom"
        />
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType === "number"}
              onChange={event => handleChange(event.target.value)}
              value="number"
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
      {forwardToType === "number" &&
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
          updateValue={(maskedValue, unmaskedValue, isValid) => {
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
          }}
        />
      }
    </EntryFormContainer>
  );
};

ForwardToEntryForm.propTypes = {
  updateForwardTo: PropTypes.func.isRequired,
  skills: PropTypes.array.isRequired,
  workers: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: PropTypes.object,
      id: PropTypes.string,
      sid: PropTypes.string
    })
  )
};

export default ForwardToEntryForm;