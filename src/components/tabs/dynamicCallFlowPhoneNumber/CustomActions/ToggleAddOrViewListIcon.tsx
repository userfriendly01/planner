import {
  IconButton
} from "@mui/material";
import {
  Add,
  ViewList
} from "@mui/icons-material";
import React, { useState } from "react";

export interface FormFieldViewListIconVisibility {
  key: string;
  setFormFieldViewListIconVisibility: (key: string, display: boolean) => void;
}

const SHOW_VIEW_LIST_ICON = true;
const HIDE_VIEW_LIST_ICON = false;

export const ToggleAddOrViewListIcon = (
  {
    key,
    setFormFieldViewListIconVisibility
  }: FormFieldViewListIconVisibility):JSX.Element => {
  const [displayViewListIcon, setDisplayViewListIcon] = useState(false);
  function viewListIconVisibility(visible: boolean){
    setDisplayViewListIcon(visible);
    setFormFieldViewListIconVisibility(key, visible);
  }
  return (
    <div>
      {displayViewListIcon?<IconButton  onClick={()=>{ viewListIconVisibility(HIDE_VIEW_LIST_ICON); }} aria-label="displayDataRequestButton" edge="start">
        <ViewList />
      </IconButton>:<IconButton  onClick={()=>{ viewListIconVisibility(SHOW_VIEW_LIST_ICON); }} aria-label="addDataRequestButton" edge="start">
        <Add />
      </IconButton>}
    </div>
  );
};