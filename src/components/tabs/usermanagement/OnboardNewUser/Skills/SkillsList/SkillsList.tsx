import { SkillDropdownProps } from "usermanagement/SkillsList.Interfaces";
import { Dropdown } from "components/Dropdown";
import { useFormState } from "context/appContext";
import { formModes } from "globals";
import React from "react";
import styled from "styled-components";
import { CustomRenderProps } from "../DefaultSkillSelector/DefaultSkillSelector.Interfaces";

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

  return (
    <Dropdown
      disableClear
      disabled={form.formMode === formModes.DELETE}
      styles={{
        small: true,
        height: "40px",
        width: "210px"
      }}
      CustomRender={({ option }: CustomRenderProps) => {
        return (
          <div>
            {option.isSkillGroup && (
              <>
                <div>
                  {option.label}
                </div>
                <SubText>
                  Default Skill Grouping
                </SubText>
              </>
            )}
            {!option.isSkillGroup && (
              <div>
                {option.label}
              </div>
            )}
          </div>
        );
      }}
      options={[
        ...skillGroups
          .map(option => ({
            value: option.id,
            label: option.skill_group_name,
            isSkillGroup: true,
            skills: option.skills
          })),
        {
          label: "divider",
          value: "divider"
        },
        ...skills
          .map(skill => ({
            label: skill.name,
            value: skill.name
          }))
      ]}
      value={{
        label: skill,
        value: skill
      }}
      updateValue={(_event: any, newInputValue: any) => updateSkill(newInputValue)}
    />
  );
};