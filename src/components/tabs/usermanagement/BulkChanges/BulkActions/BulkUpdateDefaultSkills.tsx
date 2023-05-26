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

  const dropdownOptions = [
    {
      label: "Add Skill",
      value: "Add Skill"
    },
    {
      label: "Delete Skill",
      value: "Delete Skill"
    },
    {
      label: "Override Skill",
      value: "Override Skill"
    }
  ];

  const [ option, setOption ] = React.useState({
    label: null,
    value: null
  });

  const formatOptionsDropdownEntry = (o: any) => {
    if (o) {
      return {
        label: `${o.label}`,
        value: `${o.value}`
      };
    } else {
      return "";
    }
  };

  return (
    <UpdateWrapper>
      <Dropdown
        label="Options"
        value={option}
        options={dropdownOptions}
        updateValue={(event: any, option: any) => {
          console.log("option: ", option);
          console.log("option[0]: ", dropdownOptions[0]);
          setOption(option.value);
          console.log("option again: ", option.label);
          console.log("compare ", option.label === dropdownOptions[0].label); // this is true......
        }}
        styles={{
          margin: "40 0 30 0",
          width: "300px"
        }}
      />

      { option && option.label === dropdownOptions[0].label &&
        <h1> option matches!! </h1>
      }

      { option && option.label === dropdownOptions[0].label &&
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