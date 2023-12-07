import React from "react";
import {
  act, render, setupMockedComponents
} from "testUtils";
import {
  Chip, Popover
} from "@mui/material";
import { default as ModalOnHover } from "../ModalOnHover";

const renderModalOnHover = () =>{
  return(
    render(
      <ModalOnHover label="testLabel">
        <div></div>
      </ModalOnHover>
    )
  );
};

jest.mock("@mui/material",()=>({
  __esModule: true,
  Chip: jest.fn(),
  Popover: jest.fn()
}));



describe("<ModalOnHover />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
    setupMockedComponents({
      Chip,
      Popover
    });
  });
  test("Check on Mouse on Hover", ()=>{
    renderModalOnHover();
    const onMouseEnter = Chip.mock.calls[0][0].onMouseEnter;
    act(()=>{
      onMouseEnter({ event: { currentTarget: Popover }});
    });
    expect(Chip.mock.calls.length).toBe(2);
  });
  test("Check on Mouse on Leave", ()=>{
    renderModalOnHover();
    const onMouseEnter = Chip.mock.calls[0][0].onMouseEnter;
    act(()=>{
      onMouseEnter({ event: { currentTarget: Popover }});
    });
    const onMouseLeave = Chip.mock.calls[1][0].onMouseLeave;
    act(()=>{
      onMouseLeave();
    });
    expect(Chip.mock.calls.length).toBe(3);
  });
});