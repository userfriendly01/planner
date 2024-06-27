import {
  FormControlLabel,
  Radio
} from "@mui/material";
import { Dropdown } from "components/Dropdown";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import {
  useAdminState, useSkillState
} from "context/appContext";
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

interface ForwardToEntryFormProps {
  label: string,
  updateForwardTo: (value: string) => void
}

export const ForwardToEntryForm = (props: ForwardToEntryFormProps) => {
  const {
    label,
    updateForwardTo
  } = props;

  const getWorkerOptions = () => {
    return workers.map(worker => {
      return {
        label: `${worker.attributes.emp_first_name} ${worker.attributes.emp_last_name}`,
        value: worker.sid
      };
    });
  };

  const getSkillOptions = () => {
    return skills.map(skill => {
      return {
        label: skill.name,
        value: skill.name
      };
    });
  };

  const state = useAdminState();
  const skillState = useSkillState();

  const skills = skillState.skills;
  const workers = state.workerContext.workers;

  const [ phoneNumber, setPhoneNumber ] = React.useState({
    isValid: false,
    value: "",
    showError: false
  });

  const handleUpdatePhoneNumber = (maskedValue: string, unmaskedValue: string, isValid: boolean) => {
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

  const handleRadioChange = (selection: string) => {
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
        <Dropdown
          styles={{
            width: "210px",
            margin: "16px 0px 8px 0px"
          }}
          options={getWorkerOptions()}
          updateValue={(event: any, worker: any) => updateForwardTo(worker ? worker.value : "")}
        />
      }
      {forwardToType === "skill" &&
        <Dropdown
          styles={{
            width: "210px",
            margin: "16px 0px 8px 0px"
          }}
          options={getSkillOptions()}
          updateValue={(event: any, skill: any) => updateForwardTo(skill ? skill.value : "")}
        />
      }
      {forwardToType === "phoneNum" &&
        <PhoneNumberInput
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