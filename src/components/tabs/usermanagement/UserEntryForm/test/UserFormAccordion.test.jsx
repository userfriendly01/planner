import UserFormAccordion from "../UserFormAccordion";
import {
  Accordion,
  AccordionTab
} from "@lmig/lmds-react-accordion";
import {
  BasicFormInfo,
  CallRecordingForm,
  SkillsFormInfo,
  StyledButton
} from "components";
import React from "react";
import {
  expectOnlyPassedProps,
  mockStore,
  render,
  setupMockedComponents,
  profileList,
  managerList,
  mockWorkers,
  mockSkills
} from "testUtils";

jest.useFakeTimers();

jest.mock("components", () => ({
  __esModule: true,
  BasicFormInfo: jest.fn(),
  CallRecordingForm: jest.fn(),
  SkillsFormInfo: jest.fn(),
  StyledButton: jest.fn()
}));

jest.mock("@lmig/lmds-react-accordion", () => ({
  __esModule: true,
  Accordion: jest.fn(),
  AccordionTab: jest.fn()
}));

const mockForwardToToggle = jest.fn();

describe("<UserFormAccordion />", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.reset();
    setupMockedComponents({
      BasicFormInfo,
      CallRecordingForm,
      SkillsFormInfo,
      StyledButton,
      Accordion,
      AccordionTab
    });
  });

  const renderComponent = () => {
    return render(
      <UserFormAccordion
        skills={mockSkills}
        worker={mockWorkers[0]}
        workers={mockWorkers}
        profiles={profileList}
        managers={managerList}
        forwardToToggle={false}
        setForwardToToggle={mockForwardToToggle}
      />
    );
  };


  test("Should render the correct initial state", () => {
    renderComponent("insert");
    render(Accordion.mock.calls[0][0].children);
    expect(AccordionTab.mock.calls[0][0].labelVisual).toBe("Basic Info");
    expect(AccordionTab.mock.calls[1][0].labelVisual).toBe("Call Recording");
    expect(AccordionTab.mock.calls[2][0].labelVisual).toBe("Default Skills");

    render(AccordionTab.mock.calls[0][0].children);
    render(AccordionTab.mock.calls[1][0].children);
    render(AccordionTab.mock.calls[2][0].children);

    const expectedBasicFormProps = {
      skills: mockSkills,
      worker: mockWorkers[0],
      workers: mockWorkers,
      profiles: profileList,
      managers: managerList,
      forwardToToggle: false,
      setForwardToToggle: mockForwardToToggle
    };
    expectOnlyPassedProps(BasicFormInfo, expectedBasicFormProps);
    expect(SkillsFormInfo.mock.calls.length).toBe(1);
    expect(CallRecordingForm.mock.calls.length).toBe(1);
  });
});