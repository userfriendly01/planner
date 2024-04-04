import {
  AlohaFlowContainer,
  AlohaRoutingContainer,
  BulkChanges,
  CallFlowManagementSkills,
  CallFlowManagementTfn,
  CompareProfiles,
  DynamicFlowContainer,
  ProfileDirectoryContainer,
  ProfileDialListContainer,
  ProfileSettingsContainer,
  TritonUsersViewWrapper,
  UserEntryForm,
  WfmUsersViewWrapper,
  CalabrioOrgWrapper,
  CalabrioRolesWrapper
} from "components";

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
    path: "/triton-admin/aloha-routing",
    Component: AlohaRoutingContainer
  }
];
