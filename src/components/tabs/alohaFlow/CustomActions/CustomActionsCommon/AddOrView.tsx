import {
  Grid, IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import React, { useState } from "react";

export interface AddOrViewProps{
  navigateViewOrAdd:(display:boolean,keys:string)=>void
  keys?:string
}
export const AddOrView = ({
  navigateViewOrAdd, keys
}:AddOrViewProps):JSX.Element => {
  const [navButton, setNavButton] = useState(false);
  function navigateButton(display:boolean){
    setNavButton(display);
    navigateViewOrAdd(display,keys);
  }
  return (
    <div>
      {navButton?<IconButton  onClick={()=>{ navigateButton(false); }} aria-label="displayDataRequestButton" edge="start">
        <ViewListIcon />
      </IconButton>:<IconButton  onClick={()=>{ navigateButton(true); }} aria-label="addDataRequestButton" edge="start">
        <AddIcon />
      </IconButton>}
    </div>
  );
};