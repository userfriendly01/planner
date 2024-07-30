import DynamicCallFlowPhoneNumberContainer from "dynamicCallFlowPhoneNumber/DynamicCallFlow.PhoneNumber.Container";
import { Permissions } from "authentication/authenticationInterfaces";
import { Tabs } from "@mui/material";

interface ADMIN_UI_TAB_DROPDOWN {
  route: string;
  label: string;
}

interface ADMIN_UI_TAB_CONFIGURATION {
  value: string;
  label: string;
  route: string;
  dropdown: Array<ADMIN_UI_TAB_DROPDOWN>;
}


export const DYNAMIC_CALL_FLOW_TAB_CONFIGURATION: ADMIN_UI_TAB_CONFIGURATION = {
  value: "dynamic-call-flow-management",
  label: "Dynamic Call Flow",
  route: "/triton-admin/dynamic-call-flow-phone-number",
  dropdown: [
    {
      route: "/triton-admin/dynamic-call-flow-phone-number",
      label: "Phone Number"
    },
    {
      route: "/triton-admin/dynamic-call-flow-configuration",
      label: "Call Flow Configuration"
    }
  ]
};
Object.freeze(DYNAMIC_CALL_FLOW_TAB_CONFIGURATION);