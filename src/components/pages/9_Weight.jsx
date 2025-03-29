/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import styled from "styled-components";
import grid from "../../assets/images/grid.png";
import { Divider } from "@mui/material";
import { Header } from "../planner/Header";
//LEFT
const LeftGrid = styled.img`
  height: 100%;
  width: 430px;
  align-self: end;
`;

const LeftWrapper = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  justify-content: space-around;
`;

const WeightColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px 0px;
  height: 100%;
  justify-content: flex-start;
`;

const LeftTopDateRow = styled.div`
  display: flex;
  height: 30px;
  margin: 0px 13px;
  width: 82%;
  align-self: end;
`;

const Line = styled(Divider)`
  margin: 9.1px !important;
  width: 35px;
`;

const RereLine = styled(Divider)`
  margin: 7px 9.1px 9.1px 9.1px !important;
  width: 35px;
`;

//RIGHT
const RightGrid = styled.img`
  height: 100%;
  width: 450px;
  align-self: baseline;
`;

const RightTopDateRow = styled.div`
  display: flex;
  height: 30px;
  margin: 0px 13px;
  width: 82%;
  align-self: start;
`;

const RightWrapper = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  justify-content: space-around;
`;

const SlantedLine = () => ((
  <div style={{
    display: "flex",
    alignItems: "end"
  }}
  >
    <Divider style={{
      margin: "11px",
      width: "90%",
      rotate: "105deg"
    }}/>
  </div>
));

export const Weight = ({
  side
}) => {
  if(side === "L"){
    return (
      <Page>
        <Header>WEIGHT</Header>
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
        </LeftTopDateRow>
        <LeftWrapper>
          <WeightColumn>
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
            <RereLine/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
          </WeightColumn>
          <LeftGrid alt="calendar" src={grid} />
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
        </RightTopDateRow>
        <LeftWrapper>
          <LeftGrid alt="calendar" src={grid} />
          <WeightColumn>
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
            <RereLine/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
            <Line/>
          </WeightColumn>
        </LeftWrapper>
      </Page>
    );
  }
};