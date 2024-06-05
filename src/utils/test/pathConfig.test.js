import {
  getConfigPaths,
  getWebpackPaths,
  getJestConfigPaths
} from "../../../pathConfig";
const path = require("path");

const resolvePathInSrc = resourceInSrc => {
  return resourceInSrc
    ? path.resolve("/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui", "src", resourceInSrc)
    : path.resolve("/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui", "src");
};

describe("", () => {
  test("", () => {
    expect(true).toBe(true);
    // expect(getWebpackPaths(resolvePathInSrc).components).toBe("butts");
  });
});

/*
Webpack Paths

["/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/utils/test/src/components/tabs/alohaFlow"]

[
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/SearchBox",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/SharedComponents",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/CustomToast",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/CustomDropdown",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/CustomInput",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/CSVReader",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/ExportButton",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/ModalFetchingRing",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/ModalHelperText",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/ModalOverlay",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/NNumberInput",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/NotificationModal",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/Pagination",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/PaperContainer",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/PhoneNumberInput",
   "/Users/n0263786/Desktop/Repositories/cicct-softphone-admin-ui/src/components/core/StyledButton"
]
/
// /kk//bhh÷
*/