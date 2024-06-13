import { SkillDropdownProps } from "usermanagement/SkillsList.Interfaces";
import { Dropdown } from "components/Dropdown";
import { useFormState } from "context/appContext";
import { formModes } from "globals";
import React from "react";
import styled from "styled-components";

const SubText = styled.div`
  font-size: 10px;
  font-weight: bold
`;

export const SkillsList = (props: SkillDropdownProps) => {
  const {
    skills,
    updateSkill,
    skill,
    skillGroups
  } = props;

  const form = useFormState();


  const getSkillAndSkillGroupOptions = () => {
    const optionsList = [];

    // skill groups
    skillGroups.forEach(option => {
      optionsList.push({
        value: option.skillGroupId,
        label: option.skillGroupNme,
        isSkillGroup: true,
        skills: option.skills
      });
    });

    optionsList.push({
      label: "divider",
      value: "divider"
    });
    // skills
    skills.forEach(skill => {
      optionsList.push({
        label: skill.name,
        value: skill.name
      });
    });

    return optionsList;
  };

  const DropdownOption = (props: any) => {
    const {
      option
    } = props;

    return (
      <div>
        {  option.label === "divider"
          ? <hr /> :
          !option.isSkillGroup ? (
            <>
              <div>
                {option.label}
              </div>
            </>
          )
            :          <>
              <div>
                {option.label}
              </div>
              <SubText>
                Default Skill Grouping
              </SubText>
            </>
        }
      </div>
    );
  };

  return (
    <Dropdown
      disabled={form.formMode === formModes.DELETE}
      styles={{
        small: true,
        height: "40px",
        width: "210px"
      }}
      CustomRender={DropdownOption}
      options={[...getSkillAndSkillGroupOptions()]}
      value={{
        label: skill,
        value: skill
      }}
      updateValue={(event: any, newInputValue: any) => updateSkill(newInputValue)}
    />
  );
};