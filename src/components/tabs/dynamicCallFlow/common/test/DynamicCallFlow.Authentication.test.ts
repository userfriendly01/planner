import {
  userHasReadWriteAccess, userDoesNotHaveReadWriteAccess
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Authentication";
import { ADGroupPermission } from "globals/interfaces";

jest.mock("utils/alohaConfigUtils", () => ({
  readWriteAccess: jest.fn()
}));

import { readWriteAccess } from "utils/alohaConfigUtils";

describe("Authentication", () => {
  const permissions: Array<ADGroupPermission> = [];
  const role = "testRole";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shouldReturnTrueWhenUserHasReadWriteAccess", () => {
    (readWriteAccess as jest.Mock).mockReturnValue(true);
    const result = userHasReadWriteAccess(permissions, role);
    expect(result).toBe(true);
    expect(readWriteAccess).toHaveBeenCalledWith(permissions, role);
  });

  it("shouldReturnFalseWhenUserDoesNotHaveReadWriteAccess", () => {
    (readWriteAccess as jest.Mock).mockReturnValue(false);
    const result = userDoesNotHaveReadWriteAccess(permissions, role);
    expect(result).toBe(true);
    expect(readWriteAccess).toHaveBeenCalledWith(permissions, role);
  });
});