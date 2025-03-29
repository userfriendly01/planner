/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import styled from "styled-components";
import { Divider } from "@mui/material";

const MiniHeader = styled.div`
  margin: 10px 5px;
  width: 7%;
  font-size: 8px;
  align-content: end;
  text-align: center;
`;
const HeaderRow = ({ meal }) => ((
  <div style={{
    display: "flex",
    alignContent: "center",
    width: "100%",
    fontFamily: "Optima, sans-serif"
  }}>
    <div style={{
      margin: "0px 10px",
      width: "60%",
      fontSize: "25px"
    }}> {meal} </div>
    <MiniHeader>Calories</MiniHeader>
    <MiniHeader>Protein</MiniHeader>
    <MiniHeader>Carbs</MiniHeader>
    <MiniHeader>Fat</MiniHeader>
  </div>
));

const EntryRow = () => ((
  <div style={{
    display: "flex",
    width: "100%"
  }}>
    <Divider style={{
      margin: "10px",
      width: "60%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
  </div>
));

export const Meals = ({ side }) => {
  if(side === "L"){
    return (
      <Page>
        <Header>MEAL IDEAS</Header>
        <HeaderRow meal="Breakfast"/>
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
        <HeaderRow meal="Lunch"/>
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
          height: "61px",
          fontSize: "10px",
          alignContent: "center",
          textAlign: "center",
          fontFamily: "Optima, sans-serif"
        }}>
          Tags: (H)ealthy, (L)azy, (S)pecial (P)repable
        </div>
        <HeaderRow meal="Snacks"/>
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
        <HeaderRow meal="Dinner"/>
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