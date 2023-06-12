import {
  Row,
  UpdateWrapper
} from "../BulkChanges.Styles";
import {
  Template,
  BulkUpdateProps,
  WorkerAttribute
} from "../BulkChanges.Interfaces";
import { availableAttributes } from "../BulkTemplates/index";
import {
  CustomInput,
  Dropdown,
  DefaultSkillSelector
} from "components";
import {
  useFormState,
  useFormDispatch,
  userFormActions,
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
          data: {
            key: "default_skills",
            value: updatedDefaultSkills,
            option: skillOption
          }
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
    <UpdateWrapper>
      <Dropdown
        label="Options"
        value={skillOption.label}
        options={dropdownOptions}
        updateValue={(event: any, option: any) => {
          console.log("option: ", option);
          setSkillOption(option);
          // remove what has been set as default skill when changing option
          setUpdatedDefaultSkills({
            skills: [],
            levels: {}
          });
        }}
        styles={{
          // margin: "40 40 30 0",
          // width: "175px"
          width: "230px",
          margin: "10px 20px 0px 20px"
        }}
      />

      { skillOption.value === "OVERRIDE" &&
        <DefaultSkillSelector
          defaultSkills={updatedDefaultSkills}
          setDefaultSkills={(updatedDefaultSkills: any) => {
            // add skills to state array thing here
            console.log("&&& setting default skills: ", updatedDefaultSkills);
            setUpdatedDefaultSkills(updatedDefaultSkills);
            console.log("&&& updated template: ", selectedTemplates);
          }}
        />
      }
      { skillOption.value === "DELETE" &&
        <Dropdown
          label="Skill to Delete"
          value={updatedDefaultSkills[0]} // since we are only doing one skill at a time, this will be the first value in the 
          options={skillsDropdownOptions}
          updateValue={(event: any, skillOption: any) => {
            setUpdatedDefaultSkills({
              skills: [skillOption.value],
              levels: {}
            });
          }}
          styles={{
            // margin: "40 40 30 0",
            // width: "175px"
            width: "230px",
            margin: "10px 20px 0px 20px"
          }}
        />
      }
    </UpdateWrapper>
  );
};

export default BulkUpdateDefaultSkills;