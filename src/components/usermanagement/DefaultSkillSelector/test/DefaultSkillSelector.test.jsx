// import DefaultSkillSelector from "../DefaultSkillSelector";
// import {
//   AddPriorityDropDown,
//   AddSkillDropDown,
//   DefaultPriorityDropDown
// } from "components";
// import { initialState } from "context";
// import React from "react";
// import { act } from "react-dom/test-utils";
// import {
//   expectMockedComponent,
//   expectOnlyPassedProps,
//   render,
//   setupMockedComponents
// } from "testUtils";

// jest.mock("components", () => ({
//   __esModule: true,
//   AddPriorityDropDown: jest.fn(),
//   AddSkillDropDown: jest.fn(),
//   DefaultPriorityDropDown: jest.fn()
// }));

// const initialTestState = {
//   ...initialState,
//   skillsContext: {
//     skills: [
//       {
//         minimum: null,
//         multivalue: false,
//         name: "grscollections-l1",
//         maximum: null
//       },
//       {
//         minimum: 0,
//         multivalue: true,
//         name: "test",
//         maximum: 3
//       },
//       {
//         minimum: 1,
//         multivalue: true,
//         name: "sbscFarm",
//         maximum: 3
//       },
//       {
//         minimum: 1,
//         multivalue: true,
//         name: "bscCbsHelpDesk",
//         maximum: 3
//       }
//     ]
//   }
// };

// describe("<DefaultSkillSelector />", () => {
//   const defaultSkills = {
//     skills: ["psu-l1", "psu-l2", "466"],
//     levels: {
//       "psu-l1": 3,
//       "psu-l2": 4
//     }
//   };

//   const renderComponent = () => render(<DefaultSkillSelector defaultSkills={defaultSkills} />, initialTestState);
//   beforeEach(() => {
//     setupMockedComponents({
//       AddPriorityDropDown,
//       AddSkillDropDown,
//       DefaultPriorityDropDown
//     });
//   });

//   test("should render header", () => {
//     const rendered = renderComponent();
//     expect(rendered.container).toHaveTextContent(">Default Profile");
//   });

// });