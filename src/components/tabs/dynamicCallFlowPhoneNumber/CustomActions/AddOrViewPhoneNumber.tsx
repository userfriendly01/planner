import {
  IconButton
} from "@mui/material";
import {
  Add,
  ViewList
} from "@mui/icons-material";
import React, { useState } from "react";

export interface AddOrViewProps{
  navigateViewOrAdd:(display:boolean,keys:string)=>void
  key?:string
}
export const AddOrViewPhoneNumber = ({
  navigateViewOrAdd, key
}:AddOrViewProps):JSX.Element => {
  const [navButton, setNavButton] = useState(false);
  function navigateButton(display:boolean){
    setNavButton(display);
    navigateViewOrAdd(display,key);
  }
  return (
    <div>
      {navButton?<IconButton  onClick={()=>{ navigateButton(false); }} aria-label="displayDataRequestButton" edge="start">
        <ViewList />
      </IconButton>:<IconButton  onClick={()=>{ navigateButton(true); }} aria-label="addDataRequestButton" edge="start">
        <Add />
      </IconButton>}
    </div>
  );
};