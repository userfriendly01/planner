import {
  IconButton
} from "@mui/material";
import {
  Add,
  ViewList
} from "@mui/icons-material";
import React, { useState } from "react";
import {FormFieldControlManager} from "./Form.Field.Control.Manager";

export interface ViewListIconToggleComponentProps {
  field: string;
  formFieldControl: FormFieldControlManager;
}

const SHOW_VIEW_LIST_ICON = true;
const HIDE_VIEW_LIST_ICON = false;

export const ViewListIconToggleForm = (
  {
    field,
    formFieldControl
  }: ViewListIconToggleComponentProps):JSX.Element => {

  const [displayViewListIcon, setDisplayViewListIcon] = useState(false);

  function showViewListIcon() {
    setDisplayViewListIcon(SHOW_VIEW_LIST_ICON);
    formFieldControl.toInput(field);
  }

  function showAddIcon() {
    setDisplayViewListIcon(HIDE_VIEW_LIST_ICON);
    formFieldControl.toOriginal(field);
  }

  return (
    <div>
      <IconButton onClick={() => {
        displayViewListIcon ? showAddIcon() : showViewListIcon();
      }} aria-label={`display-${field}-${formFieldControl.original(field)}`} edge="start">
        {displayViewListIcon ?<ViewList/>:<Add/>}
      </IconButton>
    </div>);
};