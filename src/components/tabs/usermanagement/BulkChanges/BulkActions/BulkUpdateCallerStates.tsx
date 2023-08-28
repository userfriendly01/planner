import { CallerStateAttrDropDownOptions } from "./callerStateList";
import {
  UpdateWrapper,
  CallerStatesSelectorContainer
} from "../BulkChanges.Styles";
import {
  Template,
  BulkCallerStatesProps
} from "../BulkChanges.Interfaces";
import {
  Dropdown
} from "components";
import {
  useAdminState
} from "context";
import React from "react";

const BulkUpdateCallerStates = (props: BulkCallerStatesProps): any => {
  const {
    template,
    selectedTemplates,
    replaceTemplate,
    updateTemplate,
    removeTemplate
  } = props;

  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);

  const dropdownOptions = [
    {
      label: "Add Caller State(s)",
      value: "ADD"
    },
    {
      label: "Delete Caller State(s)",
      value: "DELETE"
    },
    {
      label: "Override Caller States",
      value: "OVERRIDE"
    }
  ];

  const [ callerStatesOption, setCallerStatesOption ] = React.useState<any>({
    value: "",
    label: ""
  });
  const [ updatedCallerStates, setUpdatedCallerStates ] = React.useState<any>([]);

  // const skills = useAdminState().skillContext.skills.slice().filter(s => s.levels);
  // const skillsDropdownOptions = skills.map( s => ({
  //   label: s.name,
  //   value: s.name
  // }));

  React.useEffect(() => {
    console.warn("selectedTemplates", selectedTemplates);
    if (updatedCallerStates.length) {
      const templateFound = selectedTemplates.find((t: Template) => t.name === template.name);
      if (!templateFound) {
        replaceTemplate({
          ...template,
          data: {
            key: "callerStates",
            value: updatedCallerStates,
            option: callerStatesOption
          }
        });
      } else {
        updateTemplate(templateFound, {
          key: "callerStates",
          value: updatedCallerStates,
          option: callerStatesOption
        });
      }
    } else {
      if(selectedTemplates.find((t: Template) => t.name === template.name)){
        removeTemplate(template);
      }
    }
  }, [updatedCallerStates]);

  React.useEffect(() => {
    if(selectedTemplates.length === 0){
      setUpdatedCallerStates([]);
    }
  }, [selectedTemplates]);

  return (
    <UpdateWrapper adjustibleHeight={true}>
      <Dropdown
        label="Options"
        value={callerStatesOption.label}
        options={dropdownOptions}
        updateValue={(event: any, option: any) => {
          option ? setCallerStatesOption(option) : {
            value: "",
            label: ""
          };
          setUpdatedCallerStates([]);
        }}
        styles={{
          width: "230px",
          margin: "10px 20px 0px 20px"
        }}
      />

      { callerStatesOption.value === "OVERRIDE" &&
      <CallerStatesSelectorContainer>
        <Dropdown
          label="New value(s) for Caller State"
          value={updatedCallerStates}
          options={CallerStateAttrDropDownOptions}
          multiple={true}
          updateValue={(event: any, s: any) => {
            setUpdatedCallerStates(s.value);
          }}
          styles={{
            width: "230px",
            margin: "10px 20px 0px 20px"
          }}
        />
      </CallerStatesSelectorContainer>
      }
      { callerStatesOption.value === "ADD" &&
      <CallerStatesSelectorContainer>
        <Dropdown
          label="Caller State(s) to Add"
          value={updatedCallerStates}
          options={CallerStateAttrDropDownOptions}
          multiple={true}
          updateValue={(event: any, s: any) => {
            console.log("wsx here's what got selected", s);
            setUpdatedCallerStates(s.value);
          }}
          styles={{
            width: "230px",
            margin: "10px 20px 0px 20px"
          }}
        />
      </CallerStatesSelectorContainer>
      }
      { callerStatesOption.value === "DELETE" &&
        <Dropdown
          label="Caller State(s) to Delete"
          value={updatedCallerStates}
          options={CallerStateAttrDropDownOptions}
          multiple={true}
          updateValue={(event: any, s: any) => {
            setUpdatedCallerStates(s.value);
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

export default BulkUpdateCallerStates;