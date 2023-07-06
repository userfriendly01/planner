import {
  UpdateWrapper,
  SkillSelectorContainer
} from "../BulkChanges.Styles";
import {
  Template,
  BulkUpdateProps
} from "../BulkChanges.Interfaces";
import {
  Dropdown,
  DefaultSkillSelector
} from "components";
import {
  useAdminState
} from "context";
import React from "react";

const BulkUpdateDefaultSkills = (props: BulkUpdateProps) => {
  const {
    template,
    selectedTemplates,
    replaceTemplate,
    updateTemplate,
    removeTemplate
  } = props;

  console.log("BulkdUpdateForm - selectedTemplates", selectedTemplates);

  const dropdownOptions = [
    {
      label: "Add Skill",
      value: "ADD"
    },
    {
      label: "Delete Skill",
      value: "DELETE"
    },
    {
      label: "Override Skill",
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

  const skills = useAdminState().skillContext.skills.slice().filter(s => s.levels);
  const skillsDropdownOptions = skills.map( s => ({
    label: s.name,
    value: s.name
  }));

  React.useEffect(() => {
    console.warn("selectedTemplates", selectedTemplates);
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
          setSkillOption(option);
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

export default BulkUpdateDefaultSkills;