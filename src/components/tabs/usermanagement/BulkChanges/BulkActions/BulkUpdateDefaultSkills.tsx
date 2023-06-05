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

  const dropdownOptions = {
    ADD_SKILL: {
      label: "Add Skill",
      value: "Add Skill"
    },
    DELETE_SKILL: {
      label: "Delete Skill",
      value: "Delete Skill"
    },
    OVERRIDE_SKILL: {
      label: "Override Skill",
      value: "Override Skill"
    }
  };

  const [ option, setOption ] = React.useState("");
  const [ updatedDefaultSkills, setUpdatedDefaultSkills ] = React.useState<any>({
    skills: [],
    levels: {}
  });

  // const skills = useAdminState().skillContext.skills.slice().filter(s => s.levels);
  // const skillGroups = useAdminState().skillContext.skillGroups.slice();

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
            option: option
          }
        });
      } else {
        updateTemplate(templateFound, {
          data: {
            key: "default_skills",
            value: updatedDefaultSkills,
            option: option
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
    <Row>
      <UpdateWrapper>
        <Dropdown
          label="Options"
          value={option}
          options={Object.values(dropdownOptions)}
          updateValue={(event: any, option: any) => {
            setOption(option.label);
            console.log("**** option label: ", option.label);
          }}
          styles={{
            margin: "40 40 30 0",
            width: "175px"
          }}
        />

        { option === dropdownOptions.ADD_SKILL.label &&
        <DefaultSkillSelector
          defaultSkills={updatedDefaultSkills}
          setDefaultSkills={(updatedDefaultSkills: any) => {
            console.log("**** option: ", option);
            console.log("**** setting default skills: ", updatedDefaultSkills);
            setUpdatedDefaultSkills(updatedDefaultSkills);
            console.log("**** updated template: ", selectedTemplates);
          }}
        />
        }
      </UpdateWrapper>
    </Row>
  );
};

export default BulkUpdateDefaultSkills;