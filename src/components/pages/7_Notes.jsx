/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import { Divider } from "@mui/material";

const EntryRow = () => ((
  <div style={{
    display: "flex",
    width: "100%",
    marginLeft: "20px"
  }}>
    <Divider style={{
      margin: "10px",
      width: "90%"
    }}/>
  </div>
));

export const Notes = ({ side }) => {
  if(side === "L"){
    return (
      <Page>
        <Header>NOTES</Header>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
      </Page>
    );
  }

  if(side === "R"){
    return (
      <Page>
        <div style={{
          height: "61px"
        }}/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
      </Page>
    );
  }
};