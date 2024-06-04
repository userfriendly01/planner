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
      "components/core/ExportButton",
      "components/core/ModalFetchingRing",
      "components/core/ModalHelperText",
      "components/core/ModalOverlay",
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
      "components/tabs/callflowmanagement/SkillManagement/DefaultSkillGroups",
      "components/tabs/callflowmanagement/SkillManagement/ExportButton",
      "components/tabs/callflowmanagement/SkillManagement/SkillsHeader",
      "components/tabs/callflowmanagement/SkillManagement/SkillsTable",
      "components/tabs/callflowmanagement/SkillManagement/SkillsContainer",
      "components/tabs/callflowmanagement/SkillManagement/AddEditSkill",
      "components/tabs/callflowmanagement/SkillManagement/ActionContainer",
      "components/tabs/callflowmanagement/SkillManagement/DefaultSkillGroups",
      "components/tabs/callflowmanagement/TfnActivation",
      "components/tabs/callflowmanagement/CallFlowConfirmationModal"
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
      "components/tabs/orgmanagement"
    ]
  },
  {
    alias: "usermanagement",
    paths: [
      "components/tabs/usermanagement",
      "components/tabs/usermanagement/TritonUsersView/TritonUsersViewWrapper"
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
    pathConfig[`${entry.alias}*`] = entry.paths.map(p => `./${p}*`);
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