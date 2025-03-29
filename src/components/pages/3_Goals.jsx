/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import styled from "styled-components";
import goals1 from "../../assets/images/goals_1.png";
import goals2 from "../../assets/images/goals_2.png";

const CalendarImg = styled.img`
  height: 90%;
  width: 90%;
`;

export const Goals = ({ side }) => {
  if(side === "L"){
    return (
      <Page>
        <Header>GOALS 2025</Header>
        <CalendarImg alt="calendar" src={goals1}/>
      </Page>
    );
  }

  if(side === "R"){
    return (
      <Page>
        <div style={{ height: "61px" }}></div>
        <CalendarImg alt="calendar" src={goals2}/>
      </Page>
    );
  }
};