/*
if you get browser errors - comment out the paths until you find the culprit
Paths should only be defined if there is a folder within it
if the folder & file are the same name, you'll need to specify it a little deeper - ie "callflowmanagement/TfnActivation/TfnActivation"
*/

const paths = [
  {
    alias: "authentication",
    paths: [
      "authentication"
    ]
  },
  {
    alias: "components",
    paths: [
      "components",
      "components/core",
      "components/core/SearchBox",
      "components/core/SharedComponents",
      "components/core/CustomToast",
      "components/core/CustomDropdown",
      "components/core/CustomInput",
      "components/core/CSVReader",
      "components/core/ExportButton",
      "components/core/ModalFetchingRing",
      "components/core/ModalHelperText",
      "components/core/ModalOverlay",
      "components/core/NNumberInput",
      "components/core/NotificationModal",
      "components/core/Pagination",
      "components/core/PaperContainer",
      "components/core/PhoneNumberInput",
      "components/core/StyledButton"
    ]
  },
  {
    alias: "alohaFlow",
    paths: [
      "components/tabs/alohaFlow"
    ]
  },
  {
    alias: "alohaRouting",
    paths: [
      "components/tabs/alohaRouting"
    ]
  },
  {
    alias: "callflowmanagement",
    paths: [
      "components/tabs/callflowmanagement",
      "components/tabs/callflowmanagement/SkillManagement/ClosedFlashMessage",
      "components/tabs/callflowmanagement/SkillManagement/ClosedFlashMessage/SaveButton",
      "components/tabs/callflowmanagement/SkillManagement/ClosedFlashMessage/MessageContainer",
      "components/tabs/callflowmanagement/SkillManagement/ExportButton",
      "components/tabs/callflowmanagement/SkillManagement/SkillsHeader",
      "components/tabs/callflowmanagement/SkillManagement/SkillsTable",
      "components/tabs/callflowmanagement/SkillManagement/SkillsContainer",
      "components/tabs/callflowmanagement/SkillManagement/AddEditSkill",
      "components/tabs/callflowmanagement/SkillManagement/ActionContainer",
      "components/tabs/callflowmanagement/SkillManagement/DefaultSkillGroups"
    ]
  },
  {
    alias: "dynamicFlow",
    paths: [
      "components/tabs/dynamicFlow"
    ]
  },
  {
    alias: "orgmanagement",
    paths: [
      "components/tabs/orgmanagement",
      "components/tabs/orgmanagement/calabrio/CalabrioOrgWrapper",
      "components/tabs/orgmanagement/calabrio/CalabrioRolesWrapper",
      "components/tabs/orgmanagement/calabrio/CalabrioTeamModal",
      "components/tabs/orgmanagement/triton/DialListEntryForm",
      "components/tabs/orgmanagement/triton/DialListTable",
      "components/tabs/orgmanagement/triton/Directory",
      "components/tabs/orgmanagement/triton/DirectoryEntryForm",
      "components/tabs/orgmanagement/triton/PhoneNumberTable",
      "components/tabs/orgmanagement/triton/ProfileDropDown",
      "components/tabs/orgmanagement/triton/ProfileEntryForm",
      "components/tabs/orgmanagement/triton/ProfileSettingsContainer",
      "components/tabs/orgmanagement/triton/ProfileSettingsTable"
    ]
  },
  {
    alias: "usermanagement",
    paths: [
      "components/tabs/usermanagement",
      "components/tabs/usermanagement/WFMUsersView/WfmUserTable",
      "components/tabs/usermanagement/WFMUsersView/WfmUsersViewWrapper",
      "components/tabs/usermanagement/WFMUsersView/WfmUsersHeader",
      "components/tabs/usermanagement/WFMUsersView/InfoBanner",
      "components/tabs/usermanagement/WFMUsersView/WfmErrorBanner",
      "components/tabs/usermanagement/UserManagementWrapper",
      "components/tabs/usermanagement/TritonUsersView/TritonUsersViewWrapper",
      "components/tabs/usermanagement/TritonUsersView/TritonUserTable",
      "components/tabs/usermanagement/TritonUsersView/TritonUsersHeader",
      "components/tabs/usermanagement/TritonUsersView/ResetSkills",
      "components/tabs/usermanagement/TritonUsersView/ProfileFilterDropdown",
      "components/tabs/usermanagement/TritonUsersView/OuFilterDropdown",
      "components/tabs/usermanagement/TritonUsersView/ManagerModal",
      "components/tabs/usermanagement/TritonUsersView/ManagerDropdown",
      "components/tabs/usermanagement/TritonUsersView/ManagerDelete",
      "components/tabs/usermanagement/TritonUsersView/Filter",
      "components/tabs/usermanagement/OnboardNewUser/WfmForm",
      "components/tabs/usermanagement/OnboardNewUser/UserFormButtons",
      "components/tabs/usermanagement/OnboardNewUser/UserEntryFormWrapper",
      "components/tabs/usermanagement/OnboardNewUser/Skills/SkillsList",
      "components/tabs/usermanagement/OnboardNewUser/Skills/SkillsFormInfo",
      "components/tabs/usermanagement/OnboardNewUser/Skills/SkillLevels",
      "components/tabs/usermanagement/OnboardNewUser/Skills/DefaultSkillSelector",
      "components/tabs/usermanagement/OnboardNewUser/RoutingAttributes",
      "components/tabs/usermanagement/OnboardNewUser/ForwardToEntryForm",
      "components/tabs/usermanagement/OnboardNewUser/Extension",
      "components/tabs/usermanagement/OnboardNewUser/Extension/ExtensionInput",
      "components/tabs/usermanagement/OnboardNewUser/DeleteUserProfiles",
      "components/tabs/usermanagement/OnboardNewUser/CallRecording",
      "components/tabs/usermanagement/OnboardNewUser/BasicFormInfo",
      "components/tabs/usermanagement/CompareProfiles",
      "components/tabs/usermanagement/BulkChanges",
      "components/tabs/usermanagement/BulkChanges/Processing",
      "components/tabs/usermanagement/BulkChanges/ExportButtons",
      "components/tabs/usermanagement/BulkChanges/BulkUtils",
      "components/tabs/usermanagement/BulkChanges/BulkTemplates",
      "components/tabs/usermanagement/BulkChanges/BulkActions"
    ]
  },
  {
    alias: "context",
    paths: [
      "context",
      "context/reducers"
    ]
  },
  {
    alias: "globals",
    paths: [
      "globals"
    ]
  },
  {
    alias: "services",
    paths: [
      "services"
    ]
  },
  {
    alias: "icons",
    paths: [
      "assets/icons"
    ]
  },
  {
    alias: "utils",
    paths: [
      "utils"
    ]
  }
];

const getConfigPaths = () => {
  /*
  "./components/*",
  "./components/core/*",
  "./components/core/ModalFetchingRing/*"
  */
  const pathConfig = {
    "testUtils": ["../__test__/index.js"]
  };
  paths.forEach(entry => {
    pathConfig[`${entry.alias}/*`] = entry.paths.map(p => `./${p}/*`);
  });
  return pathConfig;
};

const getWebpackPaths = resolveFunction => {
  /*
    alohaFlow: resolvePathInSrc("components/tabs/alohaFlow"),
  */
  const pathConfig = {};
  paths.forEach(entry => {
    pathConfig[entry.alias] = entry.paths.map(p => resolveFunction(p));
  });
  return pathConfig;
};

const getJestConfigPaths = () => {
  /*
    "^alohaFlow/(.*)": "<rootDir>/src/components/tabs/alohaFlow/$1",
    "^alohaFlow$": "<rootDir>/src/components/tabs/alohaFlow",
  */

  const pathConfig = {};
  paths.forEach(entry => {
    const configArray1 = [];
    const configArray2 = [];
    entry.paths.forEach(p => {
      configArray1.push(`<rootDir>/src/${p}/$1`);
      configArray2.push(`<rootDir>/src/${p}`);
    });
    pathConfig[`^${entry.alias}/(.*)`] = configArray1;
    pathConfig[`^${entry.alias}$`] = configArray2;
  });

  return pathConfig;
};

module.exports = {
  getConfigPaths,
  getWebpackPaths,
  getJestConfigPaths
};