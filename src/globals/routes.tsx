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
  WfmUsersViewWrapper
} from "components";
import { AppState } from "./interfaces";
import CalabrioRolesWrapper from "components/tabs/orgmanagement/calabrio/CalabrioRolesWrapper/CalabrioRolesWrapper";

export const getRoutes = (state: AppState, Home: any, azureClientId: string) => [
  {
    path: "/triton-admin",
    render: (props: any) => <Home {...props} state={state} azureClientId={azureClientId} />
  },
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