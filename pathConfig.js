/****** For importing files into this codebase, alias's are used for most of our folder paths. ********
  
  If you are creating new folders, add them to the paths array below and this file will appropriately
  update the jsconfig, tsconfig, webpack aliases & the jestConfig

  For these changes to take effect, you can run a fresh install or manually run the command: 
                            npm run-script "generate-config"
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
      "components/app",
      "components/header/Header",
      "components/header/Logo",
      "components/header/UserCard",
      "components/navigation",
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
      "components/core/PageLoadSpinner",
      "components/core/Pagination",
      "components/core/PaperContainer",
      "components/core/PhoneNumberInput",
      "components/core/StyledButton"
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
      "components/tabs/callflowmanagement/SkillManagement",
      "components/tabs/callflowmanagement/SkillManagement/ClosedFlashMessage",
      "components/tabs/callflowmanagement/SkillManagement/ClosedFlashMessage/SaveButton",
      "components/tabs/callflowmanagement/SkillManagement/ClosedFlashMessage/MessageContainer",
      "components/tabs/callflowmanagement/SkillManagement/ExportButton",
      "components/tabs/callflowmanagement/SkillManagement/SkillsHeader",
      "components/tabs/callflowmanagement/SkillManagement/SkillsTable",
      "components/tabs/callflowmanagement/SkillManagement/SkillsContainer",
      "components/tabs/callflowmanagement/SkillManagement/SkillForm",
      "components/tabs/callflowmanagement/SkillManagement/ActionContainer",
      "components/tabs/callflowmanagement/SkillManagement/DefaultSkillGroups",
      "components/tabs/callflowmanagement/CallFlowConfirmationModal",
      "components/tabs/callflowmanagement/CallFlowManagementWrapper",
      "components/tabs/callflowmanagement/TfnActivation"
    ]
  },
  {
    alias: "dynamicCallFlow",
    paths: [
      "components/tabs/dynamicCallFlow/action",
      "components/tabs/dynamicCallFlow/phoneNumber"
    ]
  },
  {
    alias: "orgmanagement",
    paths: [
      "components/tabs/orgmanagement",
      "components/tabs/orgmanagement/calabrio/CalabrioOrgWrapper",
      "components/tabs/orgmanagement/calabrio/CalabrioRolesWrapper",
      "components/tabs/orgmanagement/calabrio/CalabrioTeamModal",
      "components/tabs/orgmanagement/triton/PhoneNumberContainer",
      "components/tabs/orgmanagement/triton/ProfileDropDown",
      "components/tabs/orgmanagement/triton/PhoneNumberContainer/PhoneNumberTable",
      "components/tabs/orgmanagement/triton/PhoneNumberContainer/PhoneNumberForm",
      "components/tabs/orgmanagement/triton/ProfileSettingsContainer",
      "components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileDropDown",
      "components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileEntryForm",
      "components/tabs/orgmanagement/triton/ProfileSettingsContainer/ProfileSettingsTable"
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
    alias: "hooks",
    paths: [
      "hooks"
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

const jsConfigTemplate = {
  "compilerOptions": {
    "baseUrl": "./src",
    "jsx": "react",
    "paths": {}
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
};

const tsConfigTemplate =
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "./src",
    "esModuleInterop": true,
    "jsx": "react",
    "lib": ["ESNext", "DOM"],
    "noImplicitAny": true,
    "outDir": "./dist/",
    "paths": {},
    "sourceMap": true,
    "target": "ES2017",
    "module": "es2022",
    "moduleResolution": "node"
  }
};

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

var fs = require("fs");

jsConfigTemplate.compilerOptions.paths = getConfigPaths();
tsConfigTemplate.compilerOptions.paths = getConfigPaths();

const init = () => {
  fs.writeFile("jsconfig.json", JSON.stringify(jsConfigTemplate, null, 4), () => console.log("jsconfig successfully generated from pathConfig!"));
  fs.writeFile("tsconfig.json", JSON.stringify(tsConfigTemplate, null, 4), () => console.log("tsconfig successfully generated from pathConfig!"));
};

// eslint-disable-next-line no-undef
module.exports = {
  init,
  getWebpackPaths,
  getJestConfigPaths
};