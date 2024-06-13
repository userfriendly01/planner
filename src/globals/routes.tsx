import AlohaFlowContainer from "../components/tabs/alohaFlow/AlohaFlowContainer";
import AlohaRoutingContainer from "../components/tabs/alohaRouting/AlohaRoutingContainer";
import { CallFlowManagementSkills } from "../components/tabs/callflowmanagement/CallFlowManagementWrapper/CallFlowManagementSkills";
import { CallFlowManagementTfn } from "../components/tabs/callflowmanagement/CallFlowManagementWrapper/CallFlowManagementTfn";
import DynamicFlowContainer from "../components/tabs/dynamicFlow/DynamicFlowContainer";
import DynamicCallFlowActionContainer from "../components/tabs/dynamicCallFlow/action/DynamicCallFlow.Action.Container";
import DynamicCallFlowPhoneNumberContainer from "../components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Container";
import { BulkChanges } from "../components/tabs/usermanagement/BulkChanges/BulkChanges";
import {
  TritonUsersViewWrapper
} from "../components/tabs/usermanagement/TritonUsersView/TritonUsersViewWrapper/TritonUsersViewWrapper";
import {
  WfmUsersViewWrapper
} from "../components/tabs/usermanagement/WFMUsersView/WfmUsersViewWrapper/WfmUsersViewWrapper";
import {
  UserEntryForm
} from "../components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper";
import { CompareProfiles } from "../components/tabs/usermanagement/CompareProfiles/CompareProfiles";
import CalabrioOrgWrapper from "../components/tabs/orgmanagement/calabrio/CalabrioOrgWrapper/CalabrioOrgWrapper";
import CalabrioRolesWrapper from "../components/tabs/orgmanagement/calabrio/CalabrioRolesWrapper/CalabrioRolesWrapper";
import { ProfileSettingsContainer } from "../components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileSettingsContainer";
import { ProfileDialListContainer } from "../components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileDialListContainer";
import ProfileDirectoryContainer from "../components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileDirectoryContainer";

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
    Component: ProfileDialListContainer
  },
  {
    path: "/triton-admin/profile-directory",
    Component: ProfileDirectoryContainer
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
    path: "/triton-admin/aloha-flow",
    Component: AlohaFlowContainer
  },
  {
    path: "/triton-admin/dyn-flow",
    Component: DynamicFlowContainer
  },
  {
    path: "/triton-admin/dynamic-call-flow-phone-number",
    Component: DynamicCallFlowPhoneNumberContainer
  },
  {
    path: "/triton-admin/dynamic-call-flow-action",
    Component: DynamicCallFlowActionContainer
  },
  {
    path: "/triton-admin/aloha-routing",
    Component: AlohaRoutingContainer
  }
];
