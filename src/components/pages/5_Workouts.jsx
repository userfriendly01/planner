/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import styled from "styled-components";
import { Divider } from "@mui/material";

const MiniHeader = styled.div`
  margin: 5px 5px;
  width: 5%;
  font-size: 8px;
  align-content: end;
  text-align: center;
`;
const HeaderRow = ({ area }) => ((
  <div style={{
    display: "flex",
    alignContent: "center",
    width: "100%",
    fontFamily: "Optima, sans-serif"
  }}>
    <div style={{
      margin: "0px 10px",
      width: "29%",
      fontSize: "20px"
    }}> {area} </div>
    <MiniHeader>Weight</MiniHeader>
    <MiniHeader>Reps</MiniHeader>
    <MiniHeader>Sets</MiniHeader>
    <div style={{
      margin: "0px 10px",
      width: "29%"
    }}/>
    <MiniHeader>Weight</MiniHeader>
    <MiniHeader>Reps</MiniHeader>
    <MiniHeader>Sets</MiniHeader>
  </div>
));

const EntryRow = () => ((
  <div style={{
    display: "flex",
    width: "100%"
  }}>
    <Divider style={{
      margin: "10px",
      width: "26%"
    }}/>
    <Divider style={{
      margin: "10px 4px",
      width: "5%"
    }}/>
    <Divider style={{
      margin: "10px 4px",
      width: "5%"
    }}/>
    <Divider style={{
      margin: "10px 4px",
      width: "5%"
    }}/>
    <Divider style={{
      margin: "10px",
      width: "26%"
    }}/>
    <Divider style={{
      margin: "10px 4px",
      width: "5%"
    }}/>
    <Divider style={{
      margin: "10px 4px",
      width: "5%"
    }}/>
    <Divider style={{
      margin: "10px 4px",
      width: "5%"
    }}/>
  </div>
));

export const Workouts = ({ side }) => {
  if(side === "L"){
    return (
      <Page>
        <Header>Workouts</Header>
        <HeaderRow area="Abs"/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <HeaderRow area="Arms"/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <EntryRow/>
        <HeaderRow area="Butt"/>
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
          height: "61px",
          fontSize: "10px",
          alignContent: "center",
          textAlign: "center",
          fontFamily: "Optima, sans-serif"
        }}>
        </div>
        <HeaderRow area="Legs"/>
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
        <HeaderRow area="Full Body"/>
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