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
  userFormActions
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

  const form = useFormState();

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

  const [ option, setOption ] = React.useState(dropdownOptions.ADD_SKILL);

  // add keys to template so processing function can adjust payload body
  React.useEffect(() => {
    if (option === dropdownOptions.ADD_SKILL) {
      updateTemplate(template, {
        action: "ADD"
      });
    } else if (option === dropdownOptions.OVERRIDE_SKILL) {
      replaceTemplate({
        ...template,
        data: {
          action: "OVERRIDE"
        }
      });
    } else {
      removeTemplate({
        ...template,
        data: {
          action: "DELETE"
        }
      });
    }
  });

  // todo: delete?
  // const formatOptionsDropdownEntry = (o: any) => {
  //   if (o) {
  //     return {
  //       label: `${o.label}`,
  //       value: `${o.value}`
  //     };
  //   } else {
  //     return "";
  //   }
  // };

  return (
    <UpdateWrapper>
      <Dropdown
        label="Options"
        value={option}
        options={Object.values(dropdownOptions)}
        updateValue={(event: any, option: any) => {
          console.log("option: ", option);
          // console.log("option[0]: ", dropdownOptions[0]);
          setOption(option);
          console.log("option label again: ", option.label);
          console.log("FORRRM: ", form);
          // console.log("compare ", option.label === dropdownOptions[0].label); // this is true......
        }}
        styles={{
          margin: "40 40 30 0",
          width: "175px"
        }}
      />

      {/* { option === dropdownOptions.ADD_SKILL &&
        <h1> option matches!! </h1>
      } */}

      { option === dropdownOptions.ADD_SKILL &&
        <DefaultSkillSelector
          defaultSkills={form.defaultSkills}
          setDefaultSkills={(defaultSkills: any) => {
            console.log("setting default skills right hurr");
          }}
        />
      }
    </UpdateWrapper>
  );
};

export default BulkUpdateDefaultSkills;