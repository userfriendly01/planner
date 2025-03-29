/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import styled from "styled-components";
import leftCalendar from "../../assets/images/left_calendar.png";
import rightCalendar from "../../assets/images/right_calendar.png";

const CalendarImg = styled.img`
  height: 90%;
  width: 100%;
`;

export const Calendar = ({ side }) => {
  if(side === "L"){
    return (
      <Page>
        <Header>CALENDAR 2025</Header>
        <CalendarImg alt="calendar" src={leftCalendar}/>
      </Page>
    );
  }

  if(side === "R"){
    return (
      <Page>
        <div style={{ height: "61px" }}></div>
        <CalendarImg alt="calendar" src={rightCalendar}/>
      </Page>
    );
  }
};