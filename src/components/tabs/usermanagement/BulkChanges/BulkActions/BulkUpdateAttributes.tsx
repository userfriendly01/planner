import { UpdateWrapper } from "../BulkChanges.Styles";
import {
  Template,
  BulkUpdateProps,
  WorkerAttribute
} from "../BulkChanges.Interfaces";
import { availableAttributes } from "../BulkTemplates";
import {
  CustomInput,
  Dropdown,
  PhoneNumberInput
} from "components";
import React from "react";
import { getE164Number } from "utils";
import { Tooltip } from "@mui/material";


const BulkUpdateAttributes = (props: BulkUpdateProps) => {
  const {
    template,
    selectedTemplates,
    replaceTemplate,
    updateTemplate,
    removeTemplate
  } = props;

  const [ selectedAttribute, setSelectedAttribute ] = React.useState(availableAttributes.SELF_SERVICE_INDICATOR);
  const [ updatedAttributeValue, setUpdatedAttributeValue ] = React.useState<any>("");

  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);

  React.useEffect(() => {
    console.warn("selectedTemplates", selectedTemplates);
    // If the entries are valid, update/add the template to the selected templates.
    // If they aren't valid, remove the template from the selected templates
    // Valid templates will drive the display of the processing buttons
    if((updatedAttributeValue || updatedAttributeValue === false || updatedAttributeValue === 0) && (!selectedAttribute.validator || selectedAttribute.validator(updatedAttributeValue))){
      const templateFound = selectedTemplates.find((t: Template) => t.name === template.name);
      if(!templateFound){
        replaceTemplate({
          ...template,
          data: {
            key: selectedAttribute.label,
            value: selectedAttribute.type === "phone number" && updatedAttributeValue ? getE164Number(updatedAttributeValue) : updatedAttributeValue,
            location: selectedAttribute.location
          }
        });
      } else {
        updateTemplate(templateFound, {
          key: selectedAttribute.label,
          value: selectedAttribute.type === "phone number" && updatedAttributeValue ? getE164Number(updatedAttributeValue) : updatedAttributeValue,
          location: selectedAttribute.location
        });
      }
    } else {
      if(selectedTemplates.find((t: Template) => t.name === template.name)){
        removeTemplate(template);
      }
    }
  }, [updatedAttributeValue]);

  React.useEffect(() => {
    if(selectedTemplates.length === 0){
      setUpdatedAttributeValue("");
    }
  }, [selectedTemplates]);

  return (
    <UpdateWrapper>
      <Dropdown
        label="Attribute"
        value={selectedAttribute}
        options={Object.values(availableAttributes)}
        updateValue={(event: any, attribute: WorkerAttribute) => {
          setUpdatedAttributeValue("");
          attribute ? setSelectedAttribute(attribute) : setSelectedAttribute({
            label: "",
            value: "",
            type: "",
            location: null
          });
        }}
        styles={{
          width: "230px",
          margin: "10px 20px 0px 20px"
        }}
      />
      { selectedAttribute.type === "string" &&
          <Tooltip title={selectedAttribute.value === "callerStates" ? "Comma separated list of states" : ""}>
            <div>
              <CustomInput
                label="Attribute Value"
                name="attribute-value"
                value={updatedAttributeValue}
                updateValue={(value: string) => setUpdatedAttributeValue(value)}
                styles={{
                  width: "230px",
                  margin: "10px 20px 0px 20px"
                }}
              />
            </div>
          </Tooltip>
      }
      { selectedAttribute.type === "number" &&
        <CustomInput
          label="Attribute Value"
          name="attribute-value"
          value={updatedAttributeValue}
          updateValue={(value: string) => setUpdatedAttributeValue(value)}
          styles={{
            width: "230px",
            margin: "10px 20px 0px 20px"
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
            setUpdatedAttributeValue(option.value);
          }}
          styles={{
            width: "230px",
            margin: "10px 20px 0px 20px"
          }}
        />
      }
      { selectedAttribute.type === "phone number" &&
        <PhoneNumberInput
          id="Phone Number"
          label="Phone Number"
          number={updatedAttributeValue}
          updateValue={(maskedValue: string, unmaskedValue: string) => {
            setUpdatedAttributeValue(unmaskedValue);
          }}
        />
      }
    </UpdateWrapper>
  );
};

export default BulkUpdateAttributes;