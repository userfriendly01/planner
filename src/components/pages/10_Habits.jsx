/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import styled from "styled-components";
import graph from "../../assets/images/graph_paper_sm.png";
import { Divider } from "@mui/material";
import { Header } from "../planner/Header";

//LEFT
const LeftGraph = styled.img`
  height: 100%;
  width: 330px;
  align-self: end;
`;

const LeftWrapper = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  justify-content: end;
`;

const HabitColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  margin: 35px 0px;
  height: 100%;
  justify-content: flex-start;
`;

const LeftTopDateRow = styled.div`
  display: flex;
  height: 30px;
  margin: 0px 18px;
  width: 60%;
  align-self: end;
`;

const Line = styled(Divider)`
  margin: 11.8px !important;
  width: 100%;
`;

//RIGHT
const RightGraph = styled.img`
  height: 100%;
  width: 330px;
  align-self: baseline;
`;

const RightTopDateRow = styled.div`
  display: flex;
  height: 30px;
  margin: 0px 12px;
  width: 82%;
  align-self: baseline;
`;

const RightWrapper = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  justify-content: flex-start;
`;

const SlantedLine = () => ((
  <div style={{
    display: "flex",
    alignItems: "end",
    height: "40px",
    width: "15.5px"
  }}
  >
    <Divider style={{
      margin: "1px 3px",
      width: "30px",
      rotate: "105deg"
    }}/>
  </div>
));

export const Habits = ({
  side
}) => {
  if(side === "L"){
    return (
      <Page>
        <Header>HABIT TRACKER</Header>
        <LeftTopDateRow>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
        </LeftTopDateRow>
        <LeftWrapper>
          <HabitColumn>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
          </HabitColumn>
          <LeftGraph alt="calendar" src={graph} />
        </LeftWrapper>
      </Page>
    );
  }

  if(side === "R"){
    return (
      <Page>
        <div style={{
          height: "61px"
        }}/>
        <RightTopDateRow>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
          <SlantedLine/>
        </RightTopDateRow>
        <RightWrapper>
          <RightGraph alt="calendar" src={graph} />
          <HabitColumn style={{ margin: "35px 32px 35px 0px" }}>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
          </HabitColumn>
        </RightWrapper>
      </Page>
    );
  }
};