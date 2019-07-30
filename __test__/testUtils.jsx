// import { theme } from "consts";
import React from "react";
// import { Provider } from "react-redux";
// import { render } from "react-testing-library";
// import configureStore from "redux-mock-store";
// import thunk from "redux-thunk";
// import { ThemeProvider } from "styled-components";
export * from "react-testing-library";

// const frozenTheme = { ...theme };
// Object.freeze(frozenTheme);
// export { frozenTheme as theme };

// const customRender = (children, store) => {
//   const reduxStore = store || createMockStore({});
//   return render(
//     <Provider store={reduxStore}>
//       <ThemeProvider theme={theme}>
//         {children}
//       </ThemeProvider>
//     </Provider>
//   );
// };
// export { customRender as render };

// export const createMockStore = state => {
//   const middlewares = [ thunk ];
//   const mockStore = configureStore(middlewares);
//   return mockStore({ ...state });
// };

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

const getNumberOfComponents = (rendered, componentString) => rendered.queryAllByText(componentString).length || 0;

export const setupMockedComponents = objOfMockedComponents => {
  const keys = Object.keys(objOfMockedComponents);
  keys.forEach(k => {
    const jestFn = objOfMockedComponents[k];
    jestFn.mockClear();
    jestFn.mockReturnValue(<div>{k}</div>);
  });
};
