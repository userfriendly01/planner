import React from "react";
import {
  AlohaFlowContainer,
  AlohaRoutingContainer,
  BulkChanges,
  CallFlowManagementSkills,
  CallFlowManagementTfn,
  ProfileDirectoryContainer,
  ProfileDialListContainer,
  ProfileSettingsContainer,
  TritonUsersViewWrapper,
  UserEntryForm,
  WfmUsersViewWrapper,
  CalabrioOrgWrapper,
  CalabrioRolesWrapper
} from "components";
import { AppState } from "./interfaces";

export const getRoutes = (state: AppState, azureClientId: string) => [
  {
    path: "/triton-admin/triton-users",
    element: TritonUsersViewWrapper
  },
  {
    path: "/triton-admin/wfm-users",
    element: WfmUsersViewWrapper
  },
  {
    path: "/triton-admin/user",
    element: UserEntryForm
  },
  {
    path: "/triton-admin/bulk",
    element: BulkChanges
  },
  {
    path: "/triton-admin/profile-dial-list",
    element: ProfileDialListContainer
  },
  {
    path: "/triton-admin/profile-directory",
    element: ProfileDirectoryContainer
  },
  {
    path: "/triton-admin/profile-settings",
    element: ProfileSettingsContainer
  },
  {
    path: "/triton-admin/calabrio-org",
    element: CalabrioOrgWrapper
  },
  {
    path: "/triton-admin/calabrio-roles",
    element: CalabrioRolesWrapper
  },
  {
    path: "/triton-admin/tfn-activation",
    element: CallFlowManagementTfn
  },
  {
    path: "/triton-admin/skill-management",
    element: CallFlowManagementSkills
  },
  {
    path: "/triton-admin/aloha-flow",
    render: (props: any) => <AlohaFlowContainer {...props} state={state} azureClientId={azureClientId} />
  },
  {
    path: "/triton-admin/aloha-routing",
    render: (props: any) => <AlohaRoutingContainer {...props} state={state} azureClientId={azureClientId} />
  }
];