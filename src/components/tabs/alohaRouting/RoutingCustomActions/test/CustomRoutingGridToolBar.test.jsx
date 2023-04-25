import React from "react";
import { CustomRoutingGridToolBar } from "../CustomRoutingGridToolBar";
import {
  render, initialTestState, act, fireEvent, within
} from "testUtils";

const openAddModal=jest.fn();
const openAdvanceSearchModal = jest.fn();
const exportDataFile = jest.fn();

const renderCustomToolBar = () =>{
  const rendered =render(
    <CustomRoutingGridToolBar
      openAddModal={openAddModal}
      openAdvanceSearchModal={openAdvanceSearchModal}
      exportDataFile={exportDataFile}
    />,
    initialTestState
  );
  return rendered;
};
describe("<CustomFlowRoutingToolBar />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  test("Simulate Custom Routing Toolbar Add Routing",()=>{
    const { getByRole } = renderCustomToolBar();
    const actionsDropdown = getByRole("button");
    act(()=>{ fireEvent.mouseDown(actionsDropdown); });
    const listBox = within(getByRole("listbox"));
    act(() => {
      fireEvent.click(listBox.getByRole("option", {
        name: /Add Routing/i,
        hidden: true
      }));
    });
    expect(openAddModal).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar Advance Search",()=>{
    const { getByRole } = renderCustomToolBar();
    const actionsDropdown = getByRole("button");
    act(()=>{ fireEvent.mouseDown(actionsDropdown); });
    const listBox = within(getByRole("listbox"));
    act(() => {
      fireEvent.click(listBox.getByRole("option", {
        name: /Advance Search/i,
        hidden: true
      }));
    });
    expect(openAdvanceSearchModal).toBeCalledTimes(1);
  });
  test("Simulate Custom Routing Toolbar Export",()=>{
    const { getByRole } = renderCustomToolBar();
    const actionsDropdown = getByRole("button");
    act(()=>{ fireEvent.mouseDown(actionsDropdown); });
    const listBox = within(getByRole("listbox"));
    act(() => {
      fireEvent.click(listBox.getByRole("option", {
        name: /Export/i,
        hidden: true
      }));
    });
    expect(exportDataFile).toBeCalledTimes(1);
  });
});