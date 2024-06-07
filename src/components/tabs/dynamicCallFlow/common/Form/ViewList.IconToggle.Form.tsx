import {
  IconButton
} from "@mui/material";
import {
  Add,
  ViewList
} from "@mui/icons-material";
import React, { useState } from "react";
import { FieldConfigs } from "./Form.Field.Config";
import { ControlEnum } from "./Form.Field.Control.Manager";
import { ReactStateAction } from "../Container.Interfaces";

export interface ViewListIconToggleFormProps {
  field: string;
  fieldConfigsReactStateAction: ReactStateAction<FieldConfigs>;
}

const SHOW_VIEW_LIST_ICON = true;
const HIDE_VIEW_LIST_ICON = false;

export const ViewListIconToggleForm = (
  {
    field,
    fieldConfigsReactStateAction
  }: ViewListIconToggleFormProps):JSX.Element => {
  const {
    state: fieldConfigs,
    setState: setFieldConfigs
  } = fieldConfigsReactStateAction;
  const [displayViewListIcon, setDisplayViewListIcon] = useState(false);

  function showViewListIcon() {
    setDisplayViewListIcon(SHOW_VIEW_LIST_ICON);
    setFieldConfigs(prevState => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        currentControl: ControlEnum.Input
      }
    }));
  }

  function showAddIcon() {
    setDisplayViewListIcon(HIDE_VIEW_LIST_ICON);
    setFieldConfigs(prevState => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        currentControl: fieldConfigs[field].originalControl
      }
    }));  }

  return (
    <div>
      <IconButton onClick={() => {
        displayViewListIcon ? showAddIcon() : showViewListIcon();
      }} aria-label={`display-${field}`} edge="start">
        {displayViewListIcon ?<ViewList/>:<Add/>}
      </IconButton>
    </div>);
};