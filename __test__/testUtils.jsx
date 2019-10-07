import {
  DispatchContext,
  StateContext,
  initialState,
  reducer
} from "context";
import { theme }from "globals";
import PropTypes from "prop-types";
import React from "react";
import { ThemeProvider } from "styled-components";
import {
  render,
  waitForElement
} from "@testing-library/react";
export * from "@testing-library/react";

let dispatchedActions = [];

export const mockStore = {
  getActions: () => [ ...dispatchedActions ],
  reset: () => dispatchedActions = []
};

const mockReducer = (state, action) => {
  dispatchedActions.push(action);
  return reducer(state, action);
};

const customRender = (childElements, initialState) => {
  const TestStateProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(mockReducer, initialState || getTestState());
    return (
      <StateContext.Provider value={state}>
        <ThemeProvider theme={theme}>
          <DispatchContext.Provider value={dispatch}>
            {children}
          </DispatchContext.Provider>
        </ThemeProvider>
      </StateContext.Provider>
    );
  };

  TestStateProvider.propTypes = {
    children: PropTypes.any
  };

  return render(
    <TestStateProvider>
      {childElements}
    </TestStateProvider>
  );
};
export { customRender as render };

export const expectMockedComponent = (rendered, component, numExpected = 1) => {
  let componentStr;
  if (typeof component === "string") {
    // string of component name such as "MyComponent"
    componentStr = component;
  } else {
    // object with single key such as { MyComponent } and will search for div with  "MyComponent"
    componentStr = Object.keys(component)[0];
  }
  expect(getNumberOfComponents(rendered, componentStr)).toBe(numExpected);
};

export const expectPassedProps = (mockedComponent, expectedProps, instanceCalled = 0) => {
  expect(mockedComponent.mock.calls[instanceCalled][0]).toEqual(expectedProps);
};

export const expectOnlyPassedProps = (mockedComponent, expectedProps, instanceCalled = 0) => {
  const actualProps = mockedComponent.mock.calls[instanceCalled][0];
  const expectedKeys = Object.keys(expectedProps);
  expectedKeys.forEach(k => {
    expect(actualProps[k]).toEqual(expectedProps[k]);
  });
};

const getDataTestIdWithInstanceCalled = (componentName, instanceCalled) => `${componentName}-${instanceCalled}`;

export const getLastInstanceCalled = mockedComponent => mockedComponent.mock.calls.length - 1;

export const getMockedComponentProps = (mockedComponent, instanceCalled = 0) => mockedComponent.mock.calls[instanceCalled][0];

const getNumberOfComponents = (rendered, componentString) => rendered.queryAllByText(componentString).length || 0;

export const setupMockedComponents = objOfMockedComponents => {
  const keys = Object.keys(objOfMockedComponents);
  keys.forEach(componentName => {
    const jestFn = objOfMockedComponents[componentName];
    jestFn.mockClear();
    const maxCalls = 20;
    for (let i = 0; i < maxCalls - 1; i++) {
      jestFn.mockReturnValueOnce(<div data-testid={getDataTestIdWithInstanceCalled(componentName, i)}>{componentName}</div>);
    }
  });
};

export const getTestState = () => ({ ...initialState });

export const waitForMockedComponent = (rendered, componentName, instanceCalled) => {
  return waitForElement(() => rendered.queryByTestId(getDataTestIdWithInstanceCalled(componentName, instanceCalled)) !== undefined);
};