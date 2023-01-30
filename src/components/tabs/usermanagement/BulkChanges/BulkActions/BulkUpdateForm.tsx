import {
  Row,
  UpdateWrapper,
  StepWrapper
} from "../BulkChanges.Styles";
import {
  updateActions,
  valueTypes
} from "../BulkChanges.Interfaces";
import { updateSelectedTemplates } from "../BulkUtils/utils";
import { getUpdateTemplates } from "../BulkUtils/templates";
import { availableAttributes } from "../BulkUtils/consts";
import {
  CustomInput,
  Dropdown,
  PhoneNumberInput
} from "components";
import { useAdminState } from "context";
import React from "react";
import { Tooltip } from "@mui/material";


const BulkUpdateForm = (props: any) => {
  const {
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const updateTemplates = getUpdateTemplates(state);
  const [ action, setAction ] = React.useState(updateTemplates.UPDATE_WORKER_ATTRIBUTE);
  const [ selectedAttribute, setSelectedAttribute ] = React.useState(availableAttributes.SELF_SERVICE_INDICATOR);
  const [ updatedAttributeValue, setUpdatedAttributeValue ] = React.useState(null);

  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);

  React.useEffect(() => {
    if(updatedAttributeValue && (selectedAttribute.validator(updatedAttributeValue) || !selectedAttribute.validator)){
      const templateFound = selectedTemplates.find((t: any) => t.name === action.name);
      if(!templateFound){
        updateSelectedTemplates(true, {
          ...action,
          data: {
            key: selectedAttribute.label,
            value: updatedAttributeValue,
            location: selectedAttribute.location
          }
        }, selectedTemplates, setSelectedTemplates);
      } else {
        templateFound.data = {
          key: selectedAttribute.label,
          value: updatedAttributeValue,
          location: selectedAttribute.location
        };
      }
    } else {
      if(selectedTemplates.find((t: any) => t.name === action.name)){
        updateSelectedTemplates(false, action, selectedTemplates, setSelectedTemplates);
      }
    }
  }, [updatedAttributeValue]);

  const constructDropdownOption = (template: any) => {
    const name = template.name.split("_").map((w: string) => {
      const word = w.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return {
      label: name.join(" "),
      value: template
    };
  };

  return (
    <Row>
      <StepWrapper>
        <Dropdown
          label="Choose a field to update"
          value={constructDropdownOption(action)}
          options={Object.values(updateTemplates).map((t: any) => constructDropdownOption(t))}
          updateValue={(event: any, template: any) => {
            console.log("TEMPLATE", template);
            setAction(template.value);
          }}
          styles={{
            margin: "40 0 30 0",
            width: "300px"
          }}
        />
      </StepWrapper>
      { action.name === updateTemplates.UPDATE_WORKER_ATTRIBUTE.name &&
        <UpdateWrapper>
          <Dropdown
            label="Attribute"
            value={selectedAttribute}
            options={Object.values(availableAttributes)}
            updateValue={(event: any, attribute: any) => setSelectedAttribute(attribute)}
            styles={{
              width: "200px",
              margin: "0px 20px"
            }}
          />
          { selectedAttribute.type === "string" || selectedAttribute.type === "number" &&
            <CustomInput
              label="Attribute Value"
              name="attribute-value"
              value={updatedAttributeValue}
              updateValue={(value: string) => setUpdatedAttributeValue(value)}
              styles={{
                width: "200px",
                margin: "0px 20px"
              }}
            />
          }
          { selectedAttribute.type === "boolean" &&
            <Dropdown
              label="Boolean"
              value={updatedAttributeValue}
              options={[
                {
                  label: "true",
                  value: true
                },
                {
                  label: "false",
                  value: false
                }
              ]}
              updateValue={(event: any, option: any) => {
                console.log("Boolean Value: ", option);
                setUpdatedAttributeValue(option.value);
              }}
              styles={{
                width: "200px",
                margin: "0px 20px"
              }}
            />
          }
          { selectedAttribute.type === "phone number" &&
            <PhoneNumberInput
              id="Phone Number"
              label="Phone Number"
              number={updatedAttributeValue}
              updateValue={(maskedValue: string, unmaskedValue: string, isValid: boolean, e164Number: string) => {
                console.log(`maskedValue: ${maskedValue} - "unmaskedValue: ${unmaskedValue} - isValid: ${isValid} - e164Number: ${e164Number}`);
                setUpdatedAttributeValue(e164Number);
              }}
            />
          }
        </UpdateWrapper>
      }
    </Row>
  );
};

export default BulkUpdateForm;