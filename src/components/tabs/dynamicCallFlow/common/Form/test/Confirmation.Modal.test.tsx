import React, { ReactElement } from "react";
import {
  waitForElementToRender
} from "dynamicCallFlowCommon/test/DynamicCallFlow.Testing.Util";
import { ConfirmationModal } from "dynamicCallFlowCommon/Form/Confirmation.Modal";
import { fireEvent } from "testUtils";

export const ConfirmationModalDataTestId = "confirmationModalDataTestId";
function createConfirmationModalElement(confirmationAction: () => void): ReactElement {
  return (
    <div data-testid={ConfirmationModalDataTestId}>
      <ConfirmationModal
        confirmationAction={confirmationAction}
        closeConfirmationModal={jest.fn()}
        isOpen={true}
        confirmationMessage="this is a test confirmation"
        confirmationButtonText = "Confirm"
      />
    </div>);
}

const mockConfirmationAction = jest.fn();

describe("Confirmation.Modal", () => {
  beforeEach(() => {
    mockConfirmationAction.mockClear();
  });

  it("should set the filter state to the filter returned from the instance of PhoneNumberDataGridFilter", async () => {
    const renderedElement = await waitForElementToRender(createConfirmationModalElement(mockConfirmationAction), ConfirmationModalDataTestId);
    fireEvent.click(renderedElement.getByText("Confirm", { selector: "button" }));
    expect(mockConfirmationAction.mock.calls.length).toBe(1);
  });
});
