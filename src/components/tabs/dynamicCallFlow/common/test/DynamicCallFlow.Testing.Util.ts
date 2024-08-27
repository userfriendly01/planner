import { ReactElement } from "react";
import {
  render, RenderResult, waitFor
} from "testUtils";
import { Tokens } from "globals/interfaces";
import { Permissions } from "authentication/authenticationInterfaces";

/**
 * Creates a deep copy of an object.
 * Preserves TypeScript types via generic type parameter.
 * @param { T } objectToCopy Object to copy
 * @returns { T } Deep copy of object
 */
export const deepCopyObject = <T>(objectToCopy: T): T => {
  return JSON.parse(JSON.stringify(objectToCopy)) as T;
};
export const MockLocalStorage: Storage = (function () {
  let store: { [key: string]: string } = {};

  return {
    key(index: number): string | null {
      return Object.keys(store)[index];
    },

    get length() {
      return Object.keys(store).length;
    },

    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key: string) {
      delete store[key];
    },

    getAll() {
      return store;
    }
  };
})();

/**
 * Checks to make sure component has loaded by looking for a testId.
 * @param { ReactElement } reactElement result from the render function.
 * @param { string } testId The test id of the element to look for.
 * @returns { Promise<void> } A promise that resolves when the element is found.
 */
export async function waitForElementToRender(reactElement: ReactElement, testId?: string): Promise<RenderResult> {
  return await waitFor<RenderResult>((): RenderResult => {
    const renderResult: RenderResult = render(reactElement);
    if (testId) {
      expect(renderResult.getByTestId(testId)).toBeDefined();
    }
    return renderResult;
  });
}

export const mockReadPermission = Permissions.READ;
export const mockContextAppContextMock: any = {
  userContext: {
    permissions: [{
      roles: [{
        name: "name",
        permissionLevel: mockReadPermission
      }],
      startup: {
        name: "name",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function: (dispatch: any, skillDispatch?: any, tokens?: Tokens) => Promise.resolve()
      },
      description: "description",
      authenticationProfile: {
        name: "name",
        permissionLevel: mockReadPermission,
        home: "home",
        tabs: ["tabs"]
      }
    }],
    tokens: {
      sharedGraph: "accessTokenGraph"
    }
  }
};

jest.mock("context/appContext", () => ({
  useAdminState: jest.fn().mockImplementation(() => {
    return mockContextAppContextMock;
  })
}));
