import { cleanupField } from "./utils";
import { isNumberValid } from "utils";

const validator = {
  MANAGER: (managerNNumber: string, state: any) => {
    const manager = state.managerContext.managers.find((m: any) => cleanupField(m, "string") === cleanupField(managerNNumber, "string"));
    if(manager){
      return true;
    } else {
      return false;
    }
  },
  NUMBER: (value: any) => {
    try {
      const parsedValue = parseInt(value);
      if(parsedValue && typeof parsedValue === "number" && parsedValue > 0){
        return true;
      } else {
        return false;
      }
    } catch(err){
      return false;
    }
  },
  OBJECT: (value: any) => {
    const object: any = {};
    const fieldArray = value.replace(" ","").replace("{","").replace("}","").split(",");

    fieldArray.forEach((f: any) => {
      const objKeyValueArray = f.replace(" ","").split(":");
      const key = objKeyValueArray[0].trim();
      const keyValue = objKeyValueArray[1].trim();
      object[key] = keyValue;
    });
    const parsedValue = JSON.parse(JSON.stringify(object));
    if(typeof parsedValue === "object" && value.charAt(0) === "{" && value.charAt(value.length -1) === "}"){
      return true;
    } else {
      return false;
    }
  },
  ARRAY: (value: any) => {
    try {
      const fieldArray = value.replace(" ","").replace("[","").replace("]","").split(",");

      if(typeof fieldArray === "object" && value.charAt(0) === "[" && value.charAt(value.length -1) === "]"){
        return true;
      } else {
        return false;
      }
    } catch(err){
      return false;
    }
  }
};

//Not all worker attribute fields would logically be bulk updated. Future stories will bulk update routing and default skills in addition to inactive fields to bulk disable users
export const availableAttributes: any = {
  ZERO_OUT_ENABLED: {
    label: "zeroOutEnabled",
    value: "zeroOutEnabled",
    type: "boolean",
    location: null
  },
  SELF_SERVICE_INDICATOR: {
    label: "selfServiceInd",
    value: "selfServiceInd",
    type: "boolean",
    location: null
  },
  MANAGER: {
    label: "manager_n_number",
    value: "manager_n_number",
    type: "string",
    validator: validator.MANAGER,
    location: null // Add tooltip that it will also update other manager fields
  },
  PROFILE: {
    label: "profile_id",
    value: "profile_id",
    type: "number",
    validator: validator.NUMBER,
    location: "attributes" // Add tooltip that it will also update agentAttribute1
  },
  DID: {
    label: "did",
    value: "did",
    type: "phone number",
    validator: isNumberValid,
    location: "attributes"// add tooltip that this is alone will not update someone's direct dial number, bulk update direct didal is not supported, this field also represents outgoing number for non DID users
  }
};
