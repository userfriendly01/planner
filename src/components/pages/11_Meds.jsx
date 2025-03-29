/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import styled from "styled-components";
import graph from "../../assets/images/graph_sectioned.png";
import { Divider } from "@mui/material";
import { Header } from "../planner/Header";

//LEFT

const MiniHeader = styled.div`
  margin: 10px 5px;
  font-size: 8px;
  align-content: end;
  padding-left: 5px;
`;

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

const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  margin: -9px 0px;
  height: 100%;
  justify-content: flex-start;
  z-index: 3;
`;

const LeftTopDateRow = styled.div`
  display: flex;
  height: 30px;
  margin: 8px -27px -10px -27px;
  width: 59.5%;
  align-self: end;
`;

const Line = () => ((
  <div style={{
    display: "flex",
    width: "100%"
  }}>
    <Divider style={{
      margin: "12.3px 10px",
      width: "58%"
    }}/>
    <Divider style={{
      margin: "12.3px 3px",
      width: "14%"
    }}/>
    <Divider style={{
      margin: "12.3px 3px",
      width: "14%"
    }}/>
  </div>
));

//RIGHT
const RightGraph = styled.img`
  height: 100%;
  width: 330px;
  align-self: baseline;
`;

const RightTopDateRow = styled.div`
  display: flex;
  height: 30px;
  width: 82%;
  margin: 8px -27px -10px -32px;
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
    width: "13.4px"
  }}
  >
    <Divider style={{
      margin: "1px 0px",
      width: "30px",
      rotate: "105deg"
    }}/>
  </div>
));

const RightLine = () => ((
  <div style={{
    display: "flex",
    width: "100%"
  }}>
    <Divider style={{
      margin: "12.3px 10px",
      width: "58%"
    }}/>
  </div>
));

export const Meds = ({
  side
}) => {
  if(side === "L"){
    return (
      <Page>
        <Header>MEDICATION TRACKER</Header>
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
          <DetailsColumn>
            <div style={{
              display: "flex",
              position: "relative"
            }}>
              <MiniHeader style={{
                width: "60%"
              }}>Medication</MiniHeader>
              <MiniHeader style={{
                width: "15%",
                position: "absolute",
                right: "23px"
              }}>Dosage</MiniHeader>
              <MiniHeader style={{
                width: "15%",
                position: "absolute",
                right: "-12px"
              }}>Frequency</MiniHeader>
            </div>
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
          </DetailsColumn>
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
          <SlantedLine/>
        </RightTopDateRow>
        <RightWrapper>
          <RightGraph alt="calendar" src={graph} />
          <DetailsColumn>
            <div style={{
              display: "flex",
              position: "relative"
            }}>
              <MiniHeader style={{
                width: "60%"
              }}>Medication</MiniHeader>
            </div>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
            <RightLine/>
          </DetailsColumn>
        </RightWrapper>
      </Page>
    );
  }
};