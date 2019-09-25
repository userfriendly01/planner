import EditUserModal from "../EditUserModal";
import MockAdapter from "axios-mock-adapter";
import {
  CustomButton,
  CustomSelect,
  ModalHeader,
  ModalOverlay,
  PaperContainer
} from "components";
import { initialState } from "context";
import { apiPaths } from "globals";
import React from "react";
import { act } from "react-dom/test-utils";
import {
  expectMockedComponent,
  expectOnlyPassedProps,
  getLastInstanceCalled,
  getMockedComponentProps,
  render,
  setupMockedComponents
} from "testUtils";
import { myAxios } from "utils";

const axiosMock = new MockAdapter(myAxios);

jest.useFakeTimers();
jest.mock("components", () => ({
  __esModule: true,
  CustomButton: jest.fn(),
  CustomSelect: jest.fn(),
  ModalHeader: jest.fn(),
  ModalOverlay: jest.fn(),
  PaperContainer: jest.fn()
}));

const mockWorker = {
  sid: "WK023315648120514",
  attributes: {
    full_name: "Faith Cuneo",
    manager_n_number: "n0999887",
    n_number: "n0263786"
  }
};

const mockManagers = [
  {
    manager_first_name: "Ben",
    manager_last_name: "Wyatt",
    manager_n_number: "n1234567"
  },
  {
    manager_first_name: "Leslie",
    manager_last_name: "Knope",
    manager_n_number: "n7454853"
  }
];

const mockHandleClose = jest.fn();

const initialTestState = {
  ...initialState,
  managerContext: {
    managers: mockManagers
  }
};

const renderComponent = () => {
  return render(<EditUserModal handleClose={mockHandleClose} worker={mockWorker} />, initialTestState);
};

describe("<EditUserModal />", () => {
  beforeEach(() => {
    setupMockedComponents({
      CustomButton,
      CustomSelect,
      ModalHeader,
      ModalOverlay
    });
    mockHandleClose.mockClear();
    //Understand why we mock the implementation of the paper container
    PaperContainer.mockClear();
    PaperContainer.mockImplementation(props => <div>{props.children}</div>);
  });

  describe("EditUserModal is in it's initial state", () => {
    test("Edit User Modal Renders the appropriate elements", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CustomSelect }, 1);
      expectMockedComponent(rendered, { CustomButton }, 2);
      expectMockedComponent(rendered, { ModalOverlay }, 0);
      expectOnlyPassedProps(CustomButton, {
        children: "Update",
        disabled: true
      }, 0);
      expectOnlyPassedProps(CustomButton, {
        children: "Close"
      }, 1);
      expect(getMockedComponentProps(ModalHeader, getLastInstanceCalled(ModalHeader)).children).toBe("Edit User");
    });
  });

  describe("EditUserModal Manager List in it's initial state", () => {
    test("EditUserModal shows the correct manager list is in it's initial state", () => {
      renderComponent();
      const expectedManagerProps = {
        label: "Manager",
        labelWidth: 65,
        optionsList: mockManagers,
        value: ""
      };
      expectOnlyPassedProps(CustomSelect, expectedManagerProps, 0);
      const optionsDisplayFunc = CustomSelect.mock.calls[0][0].optionsDisplayFunc;
      const option = optionsDisplayFunc(mockManagers[0]);
      expect(option).toEqual({
        display: `${mockManagers[0].manager_first_name} ${mockManagers[0].manager_last_name}`,
        key: mockManagers[0].manager_n_number,
        value: JSON.stringify(mockManagers[0])
      });
    });
  });

  describe("Update and Close buttons", () => {

    test("the initial state update should be disabled, and close should be enabled", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CustomButton }, 2);
      expectOnlyPassedProps(CustomButton, {
        children: "Update",
        disabled: true
      }, 0);
      expectOnlyPassedProps(CustomButton, {
        children: "Close"
      }, 1);
    });

    test("if we click the close button, it should fire props.handleClose", () => {
      const rendered = renderComponent();
      expectMockedComponent(rendered, { CustomButton }, 2);
      const closeFn = getMockedComponentProps(CustomButton, 1).onClick;
      closeFn();
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("New Manager is selected", () => {
    beforeEach(() => {
      axiosMock.onGet(apiPaths.EDIT_WORKER).reply(200, {});
    });

    test("changes made to the manager dropdown", () => {
      renderComponent();
      act(() => {
        const updateValue = CustomSelect.mock.calls[0][0].updateValue;
        updateValue(JSON.stringify(mockManagers[0]));
      });
      expect(CustomSelect.mock.calls.length).toBe(2);
      const newValue = CustomSelect.mock.calls[1][0].value;
      expect(newValue).toEqual(JSON.stringify(mockManagers[0]));
    });

    test("update button should be enabled", done => {
      renderComponent();
      act(() => {
        const updateValue = CustomSelect.mock.calls[0][0].updateValue;
        updateValue(JSON.stringify(mockManagers[0]));
        return Promise.resolve();
      }).then(() => {
        expect(CustomButton.mock.calls.length).toBe(4);
        expectOnlyPassedProps(CustomButton, {
          children: "Update",
          disabled: false
        }, 2);
        done();
      });
    });
  });

  describe("Edit User button is clicked", () => {
    describe("Success", () => {
      test("ModalOverlay should render with 'User updated successfully' & modal should close after 2 seconds (handleClose should be called)", done => {
        axiosMock.onPost(apiPaths.EDIT_WORKER).reply(200, { worker: "success" });
        const rendered = renderComponent();
        act(() => {
          const updateValue = CustomSelect.mock.calls[0][0].updateValue;
          updateValue(JSON.stringify(mockManagers[0]));
          return Promise.resolve();
        }).then(() => {
          expectOnlyPassedProps(CustomButton, {
            children: "Update",
            disabled: false
          }, 2);
          const { onClick } = CustomButton.mock.calls[2][0];
          act(() => {
            onClick();
            return Promise.resolve();
          }).then(() => {
            expectMockedComponent(rendered, { ModalOverlay }, 1);
            const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
            expect(saveStatus).toBe("success");
            act(() => jest.runAllTimers());
            expect(mockHandleClose).toBeCalled();
            done();
          });
        });
      });
    });
    describe("Failure", () => {
      test("ModalOverlay should render with 'User update failed' & modal should close after 2 seconds (handleClose should be called)", done => {
        axiosMock.onPost(apiPaths.EDIT_WORKER).networkError();
        const rendered = renderComponent();
        act(() => {
          const updateValue = CustomSelect.mock.calls[0][0].updateValue;
          updateValue(JSON.stringify(mockManagers[0]));
          return Promise.resolve();
        }).then(() => {
          expectOnlyPassedProps(CustomButton, {
            children: "Update",
            disabled: false
          }, 2);
          const { onClick } = CustomButton.mock.calls[2][0];
          act(() => {
            onClick();
            return Promise.resolve();
          }).then(() => {
            expectMockedComponent(rendered, { ModalOverlay }, 1);
            const saveStatus = getMockedComponentProps(ModalOverlay, getLastInstanceCalled(ModalOverlay)).status;
            expect(saveStatus).toBe("fail");
            act(() => jest.runAllTimers());
            done();
          });
        });
      });
    });
  });
});