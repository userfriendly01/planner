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
import { DropdownOption } from "globals/interfaces";

export const BulkUpdateDefaultSkills = (props: BulkUpdateProps) => {
  const {
    template,
    selectedTemplates,
    replaceTemplate,
    updateTemplate,
    removeTemplate
  } = props;

  const dropdownOptions: DropdownOption[] = [
    {
      label: "Add Skills",
      value: "ADD"
    },
    {
      label: "Delete Skills",
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
  const [ skillsToDelete, setSkillsToDelete ] = React.useState<any>([]);

  const skills = useSkillState().skills.slice().filter(s => s.levels);
  const skillsDropdownOptions = skills.map( s => ({
    label: s.name,
    value: s.name
  }));

  React.useEffect(() => {
    if (updatedDefaultSkills.skills.length || skillsToDelete.length) {
      const templateFound = selectedTemplates.find((t: Template) => t.name === template.name);
      if (!templateFound) {
        replaceTemplate({
          ...template,
          data: {
            key: "default_skills",
            value: updatedDefaultSkills.skills.length ? updatedDefaultSkills : skillsToDelete,
            option: skillOption
          }
        });
      } else {
        updateTemplate(templateFound, {
          key: "default_skills",
          value: updatedDefaultSkills.skills.length ? updatedDefaultSkills : skillsToDelete,
          option: skillOption
        });
      }
    } else {
      if(selectedTemplates.find((t: Template) => t.name === template.name)){
        removeTemplate(template);
      }
    }
  }, [updatedDefaultSkills, skillsToDelete]);

  React.useEffect(() => {
    if(selectedTemplates.length === 0){
      setUpdatedDefaultSkills({
        skills: [],
        levels: {}
      });
      setSkillsToDelete([]);
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

      { (skillOption.value === "ADD" || skillOption.value === "OVERRIDE") &&
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
          label="Skills to Delete"
          value={skillsToDelete}
          options={skillsDropdownOptions}
          multiple={true}
          updateValue={(event: any, s: any) => {
            setSkillsToDelete(s)
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