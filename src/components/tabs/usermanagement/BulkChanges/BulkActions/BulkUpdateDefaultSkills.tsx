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

  console.log("BulkdUpdateForm - defaultSkills - selectedTemplates", selectedTemplates);

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

  // const lemmeSeeSkills = useAdminState().skillContext.skills;
  // const lemmeSeeAdminState = useAdminState();

  const skillsDropdownOptions = skills.map( s => ({
    label: s.name,
    value: s.name
  }));

  // add keys to template so processing function can adjust payload body
  React.useEffect(() => {
    console.warn("selectedTemplates", selectedTemplates);
    if (updatedDefaultSkills.skills.length) {
      const templateFound = selectedTemplates.find((t: Template) => t.name === template.name);
      if (!templateFound) {
        console.log("**** REPLACE TEMPLATE ACTIVATE", template);
        replaceTemplate({
          ...template,
          data: {
            key: "default_skills",
            value: updatedDefaultSkills,
            option: skillOption
          }
        });
      } else {
        console.log("**** UPDATE TEMPLATE ACTIVATE", template);
        updateTemplate(templateFound, {
          key: "default_skills",
          value: updatedDefaultSkills,
          option: skillOption
        });
      }
    } else {
      console.log("**** ELSE ACTIVATE", template);
      // console.log("**** skill list: ", lemmeSeeSkills);
      // console.log("**** full admin state: ", lemmeSeeAdminState);
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
          // clear existing default skills when changing option
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
            console.log("**** option: ", skillOption);
            setUpdatedDefaultSkills(updatedDefaultSkills);
            console.log("**** setting default skills: ", updatedDefaultSkills);
          }}
        />
      </SkillSelectorContainer>
      }
      { skillOption.value === "ADD" &&
        <DefaultSkillSelector
          defaultSkills={updatedDefaultSkills}
          setDefaultSkills={(updatedDefaultSkills: any) => {
            console.log("**** option: ", skillOption);
            setUpdatedDefaultSkills(updatedDefaultSkills);
            console.log("**** setting default skills: ", updatedDefaultSkills);
            // console.log("**** updated template: ", selectedTemplates);
          }}
        />
      }
      { skillOption.value === "DELETE" &&
        <Dropdown
          label="Skill to Delete"
          value={updatedDefaultSkills[0]} // since we are only doing one skill at a time, this will always be the first value in the array
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