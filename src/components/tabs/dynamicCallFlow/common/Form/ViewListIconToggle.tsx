import {
  IconButton
} from "@mui/material";
import {
  Add,
  ViewList
} from "@mui/icons-material";
import React, { useState } from "react";
import { FormFieldControl } from "./FormField.Control";

export interface ViewListIconToggleComponentProps {
  field: string;
  fieldControl: FormFieldControl;
}

const SHOW_VIEW_LIST_ICON = true;
const HIDE_VIEW_LIST_ICON = false;

export const ViewListIconToggle = (
  {
    field,
    fieldControl
  }: ViewListIconToggleComponentProps):JSX.Element => {

  const [displayViewListIcon, setDisplayViewListIcon] = useState(false);

  function showViewListIcon() {
    setDisplayViewListIcon(SHOW_VIEW_LIST_ICON);
    fieldControl.changeToInput(field);
  }

  function showAddIcon() {
    setDisplayViewListIcon(HIDE_VIEW_LIST_ICON);
    fieldControl.changeToOriginal(field);
  }

  return (
    <div>
      <IconButton onClick={() => {
        displayViewListIcon ? showAddIcon() : showViewListIcon();
      }} aria-label={`display-${field}-${fieldControl.original(field)}`} edge="start">
        {displayViewListIcon ?<ViewList/>:<Add/>}
      </IconButton>
    </div>);
};