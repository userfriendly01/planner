import {
  UpdateWrapper,
  SkillSelectorContainer
} from "usermanagement/BulkChanges.Styles";
import {
  Template,
  BulkUpdateProps
} from "usermanagement/BulkChanges.Interfaces";
import { DefaultSkillSelector } from "usermanagement/DefaultSkillSelector";
import { Dropdown } from "components/Dropdown";
import { useSkillState } from "context/appContext";
import React from "react";

export const BulkUpdateDefaultSkills = (props: BulkUpdateProps) => {
  const {
    template,
    selectedTemplates,
    replaceTemplate,
    updateTemplate,
    removeTemplate
  } = props;

  const dropdownOptions = [
    {
      label: "Add Skills",
      value: "ADD"
    },
    {
      label: "Delete Skill",
      value: "DELETE"
    },
    {
      label: "Override Skills",
      value: "OVERRIDE"
    }
  ];

  const [ skillOption, setSkillOption ] = React.useState<any>({
    value: "",
    label: ""
  });
  const [ updatedDefaultSkills, setUpdatedDefaultSkills ] = React.useState<any>({
    skills: [],
    levels: {}
  });

  const skills = useSkillState().skills.slice().filter(s => s.levels);
  const skillsDropdownOptions = skills.map( s => ({
    label: s.name,
    value: s.name
  }));

  React.useEffect(() => {
    if (updatedDefaultSkills.skills.length) {
      const templateFound = selectedTemplates.find((t: Template) => t.name === template.name);
      if (!templateFound) {
        replaceTemplate({
          ...template,
          data: {
            key: "default_skills",
            value: updatedDefaultSkills,
            option: skillOption
          }
        });
      } else {
        updateTemplate(templateFound, {
          key: "default_skills",
          value: updatedDefaultSkills,
          option: skillOption
        });
      }
    } else {
      if(selectedTemplates.find((t: Template) => t.name === template.name)){
        removeTemplate(template);
      }
    }
  }, [updatedDefaultSkills]);

  React.useEffect(() => {
    if(selectedTemplates.length === 0){
      setUpdatedDefaultSkills({
        skills: [],
        levels: {}
      });
    }
  }, [selectedTemplates]);

  return (
    <UpdateWrapper adjustibleHeight={true}>
      <Dropdown
        label="Options"
        value={skillOption.label}
        options={dropdownOptions}
        updateValue={(event: any, option: any) => {
          option ? setSkillOption(option) : {
            value: "",
            label: ""
          };
          setUpdatedDefaultSkills({
            skills: [],
            levels: {}
          });
        }}
        styles={{
          width: "230px",
          margin: "10px 20px 0px 20px"
        }}
      />

      { skillOption.value === "OVERRIDE" &&
      <SkillSelectorContainer>
        <DefaultSkillSelector
          defaultSkills={updatedDefaultSkills}
          setDefaultSkills={(updatedDefaultSkills: any) => {
            setUpdatedDefaultSkills(updatedDefaultSkills);
          }}
        />
      </SkillSelectorContainer>
      }
      { skillOption.value === "ADD" &&
      <SkillSelectorContainer>
        <DefaultSkillSelector
          defaultSkills={updatedDefaultSkills}
          setDefaultSkills={(updatedDefaultSkills: any) => {
            setUpdatedDefaultSkills(updatedDefaultSkills);
          }}
        />
      </SkillSelectorContainer>
      }
      { skillOption.value === "DELETE" &&
        <Dropdown
          label="Skill to Delete"
          value={updatedDefaultSkills[0]}
          options={skillsDropdownOptions}
          updateValue={(event: any, s: any) => {
            setUpdatedDefaultSkills({
              skills: [s.value],
              levels: {}
            });
          }}
          styles={{
            width: "230px",
            margin: "10px 20px 0px 20px"
          }}
        />
      }
    </UpdateWrapper>
  );
};