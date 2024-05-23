import { AddOrViewPhoneNumber } from "../AddOrViewPhoneNumber";
import {
  fireEvent, render, act
} from "testUtils";
import React from "react";

const navigateViewOrAdd= jest.fn();
const renderAddOrViewFlow = () => {
  return render(
    // eslint-disable-next-line react/react-in-jsx-scope
    <AddOrViewPhoneNumber navigateViewOrAdd = {navigateViewOrAdd} />
  );
};
describe(" <AddOrView/>",()=>{
  test("Simulate display buttons",()=>{
    const { getByLabelText }=renderAddOrViewFlow();
    const navBtnsAdd = getByLabelText("addDataRequestButton");
    act(()=>{
      fireEvent.click(navBtnsAdd);
    });
    expect(navigateViewOrAdd).toBeCalledTimes(1);
    const navBtnsDisplay = getByLabelText("displayDataRequestButton");
    act(()=>{
      fireEvent.click(navBtnsDisplay);
    });
    expect(navigateViewOrAdd).toBeCalledTimes(2);
  });
});