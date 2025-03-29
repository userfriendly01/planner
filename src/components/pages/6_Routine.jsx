/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import styled from "styled-components";
import { Divider } from "@mui/material";

const MiniHeader = styled.div`
  margin: 5px 5px;
  width: 40%;
  font-size: 15px;
  align-content: end;
  text-align: left;
`;
const HeaderRow = ({ title }) => ((
  <div style={{
    display: "flex",
    alignContent: "center",
    textAlign: "left",
    margin: "10px 0px 0px 10px",
    width: "100%",
    fontFamily: "Optima, sans-serif"
  }}>
    <div style={{
      margin: "0px 10px 15px 10px",
      fontSize: "20px"
    }}> {title} </div>
  </div>
));

const EntryRow = () => ((
  <div style={{
    display: "flex",
    width: "100%",
    marginLeft: "20px"
  }}>
    <Divider style={{
      margin: "10px 4px",
      width: "8%"
    }}/>
    <Divider style={{
      margin: "10px",
      width: "35%"
    }}/>
    <Divider style={{
      margin: "10px 4px",
      width: "8%"
    }}/>
    <Divider style={{
      margin: "10px",
      width: "35%"
    }}/>
  </div>
));


export const Routine = ({ side }) => {
  if(side === "L"){
    return (
      <Page>
        <Header>Routine</Header>
        <HeaderRow title="Monday"/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <HeaderRow title="Tuesday"/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <HeaderRow title="Wednesday"/>
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
        <HeaderRow title="Thursday"/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <HeaderRow title="Friday"/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <HeaderRow title="Saturday"/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <HeaderRow title="Sunday"/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
      </Page>
    );
  }
};