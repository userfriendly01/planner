import AlohaFlowContainer from "alohaFlow/AlohaFlowContainer";
import AlohaRoutingContainer from "alohaRouting/AlohaRoutingContainer";
import { BulkChanges } from "usermanagement/BulkChanges";
import { CallFlowManagementSkills } from "callflowmanagement/CallFlowManagementSkills";
import { CallFlowManagementTfn } from "callflowmanagement/CallFlowManagementTfn";
import { CompareProfiles } from "usermanagement/CompareProfiles";
import DynamicFlowContainer from "dynamicFlow/DynamicFlowContainer";
import { PhoneNumberContainer } from "orgmanagement/PhoneNumberContainer";
import { ProfileSettingsContainer } from "orgmanagement/ProfileSettingsContainer";
import { TritonUsersViewWrapper } from "usermanagement/TritonUsersViewWrapper";
import { UserEntryForm } from "usermanagement/UserEntryFormWrapper";
import { WfmUsersViewWrapper } from "usermanagement/WfmUsersViewWrapper";
import CalabrioOrgWrapper from "orgmanagement/CalabrioOrgWrapper";
import CalabrioRolesWrapper from "orgmanagement/CalabrioRolesWrapper";

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
    path: "/triton-admin/aloha-flow",
    Component: AlohaFlowContainer
  },
  {
    path: "/triton-admin/dyn-flow",
    Component: DynamicFlowContainer
  },
  {
    path: "/triton-admin/aloha-routing",
    Component: AlohaRoutingContainer
  }
];
