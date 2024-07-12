import AlohaRoutingContainer from "alohaRouting/AlohaRoutingContainer";
import { CallFlowManagementSkills } from "callflowmanagement/CallFlowManagementSkills";
import { CallFlowManagementTfn } from "callflowmanagement/CallFlowManagementTfn";
import DynamicCallFlowActionContainer from "components/tabs/dynamicCallFlow/action/DynamicCallFlow.Action.Container";
import DynamicCallFlowPhoneNumberContainer from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Container";
import CalabrioOrgWrapper from "orgmanagement/CalabrioOrgWrapper";
import CalabrioRolesWrapper from "orgmanagement/CalabrioRolesWrapper";
import { PhoneNumberContainer } from "orgmanagement/PhoneNumberContainer";
import { ProfileSettingsContainer } from "orgmanagement/ProfileSettingsContainer";
import { BulkChanges } from "usermanagement/BulkChanges";
import { CompareProfiles } from "usermanagement/CompareProfiles";
import { TritonUsersViewWrapper } from "usermanagement/TritonUsersViewWrapper";
import { UserEntryForm } from "usermanagement/UserEntryFormWrapper";
import { WfmUsersViewWrapper } from "usermanagement/WfmUsersViewWrapper";

export const getRoutes = () => [
  {
    path: "/triton-admin/triton-users",
    Component: TritonUsersViewWrapper
  },
  {
    path: "/triton-admin/wfm-users",
    Component: WfmUsersViewWrapper
  },
  {
    path: "/triton-admin/user",
    Component: UserEntryForm
  },
  {
    path: "/triton-admin/profiles",
    Component: CompareProfiles
  },
  {
    path: "/triton-admin/bulk",
    Component: BulkChanges
  },
  {
    path: "/triton-admin/profile-dial-list",
    Component: PhoneNumberContainer
  },
  {
    path: "/triton-admin/profile-directory",
    Component: PhoneNumberContainer
  },
  {
    path: "/triton-admin/profile-settings",
    Component: ProfileSettingsContainer
  },
  {
    path: "/triton-admin/calabrio-org",
    Component: CalabrioOrgWrapper
  },
  {
    path: "/triton-admin/calabrio-roles",
    Component: CalabrioRolesWrapper
  },
  {
    path: "/triton-admin/tfn-activation",
    Component: CallFlowManagementTfn
  },
  {
    path: "/triton-admin/skill-management",
    Component: CallFlowManagementSkills
  },
  {
    path: "/triton-admin/dynamic-call-flow-phone-number",
    Component: DynamicCallFlowPhoneNumberContainer
  },
  {
    path: "/triton-admin/dynamic-call-flow-configuration",
    Component: DynamicCallFlowActionContainer
  },
  {
    path: "/triton-admin/aloha-routing",
    Component: AlohaRoutingContainer
  }
];
