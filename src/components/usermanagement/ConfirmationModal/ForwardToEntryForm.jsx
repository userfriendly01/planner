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

  const [ forwardToType, updateForwardToType ] = React.useState({
    option: "worker",
    display: <FilterableSelect
      optionsList={getWorkerOptions()}
      updateValue={worker => updateForwardTo(worker.value)}
    />
  }
  );

  const handleChange = selection => {
    switch(selection) {
      case "skill":
        updateForwardToType({
          option: "skill",
          display: <FilterableSelect
            optionsList={getSkillOptions()}
            updateValue={skill => updateForwardTo(skill.value)}
          />
        });
        break;
      case "number":
        updateForwardToType({
          option: "number",
          display: <ModalPhoneNumber
            allowSevenDigitVdn={false}
            id="forward-number-input"
            label="Forward To Number"
            number={phoneNumber.value}
            onBlur={() => setPhoneNumber({
              ...phoneNumber,
              showError: true
            })}
            showError={phoneNumber.showError}
            updateValue={(maskedValue, unmaskedValue, isValid) => {
              setPhoneNumber({
                ...phoneNumber,
                isValid,
                value: maskedValue
              });
            }}
          />
        });
        break;
      default:
        updateForwardToType({
          option: "worker",
          display: <FilterableSelect
            optionsList={getWorkerOptions()}
            updateValue={updateForwardTo}
          />
        });
    }
  };
  return (
    <EntryFormContainer>
      <LabelContainer>This user has a direct dial number. <br/> Please choose a forward to option before confirming.</LabelContainer>
      <RadioContainer>
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType.option === "worker"}
              onChange={event => handleChange(event.target.value)}
              value="worker"
            />}
          label="Person"
          labelPlacement="bottom"
        />
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType.option === "skill"}
              onChange={event => handleChange(event.target.value)}
              value="skill"
            />}
          label="Skill"
          labelPlacement="bottom"
        />
        <FormControlLabel
          control={
            <Radio
              checked={forwardToType.option === "number"}
              onChange={event => handleChange(event.target.value)}
              value="number"
            />}
          label={<LabelContainer>External<br/>Number</LabelContainer>}
          labelPlacement="bottom"
        />
      </RadioContainer>
      {forwardToType.display}
    </EntryFormContainer>
  );
};

ForwardToEntryForm.propTypes = {
  // forwardTo: PropTypes.string,
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