/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import styled from "styled-components";
import graph from "../../assets/images/graph_paper_sm.png";
import { Divider } from "@mui/material";
import { Header } from "../planner/Header";
import {
  AddReaction, ElectricBolt, DirectionsRun, Hotel
} from "@mui/icons-material";

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

const TrendsColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  justify-content: space-around;
  align-items: center
`;

const LeftTopDateRow = styled.div`
  display: flex;
  height: 30px;
  margin: 0px 18px;
  width: 60%;
  align-self: end;
`;

const Number = styled.div`
    font-family: Optima, sans-serif;
`;

const Text = styled.div`
    display: flex;
    flex-direction: column;
    font-family: Optima, sans-serif;
    font-size: 15px;
    color: ${props => props.color}
`;

const Icon = ({ icon }) => ((
  <div style={{
    display: "flex",
    width: "50px"
  }}
  >
    {icon}
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
      color: "blue",
      margin: "1px 3px",
      width: "30px",
      rotate: "105deg"
    }}/>
  </div>
));

export const Trends = ({
  side
}) => {
  if(side === "L"){
    return (
      <Page>
        <Header>TRENDS</Header>
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
          <TrendsColumn>
            <Text color="#e1c4f8">
              <Icon icon={<Hotel sx={{ color: "#e1c4f8" }} fontSize="large"/>}/>
              Sleep
            </Text>
            <Text color="#c5f7cd">
              <Icon icon={<AddReaction sx={{ color: "#c5f7cd" }} fontSize="large"/>}/>
              Mood
            </Text>
            <Text color="#c3f8f2">
              <Icon icon={<ElectricBolt sx={{ color: "#c3f8f2" }} fontSize="large"/>}/>
              Energy
            </Text>
            <Text color="#ffc9cf">
              <Icon icon={<DirectionsRun sx={{ color: "#ffc9cf" }} fontSize="large"/>}/>
              Activity
            </Text>
          </TrendsColumn>
          <div style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "3px",
            justifyContent: "space-evenly"
          }}>
            <Number>10</Number>
            <Number>9</Number>
            <Number>8</Number>
            <Number>7</Number>
            <Number>6</Number>
            <Number>5</Number>
            <Number>4</Number>
            <Number>3</Number>
            <Number>2</Number>
            <Number>1</Number>
          </div>
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
          <TrendsColumn>
            <Text color="#e1c4f8">
              <Icon icon={<Hotel sx={{ color: "#e1c4f8" }} fontSize="large"/>}/>
              Sleep
            </Text>
            <Text color="#c5f7cd">
              <Icon icon={<AddReaction sx={{ color: "#c5f7cd" }} fontSize="large"/>}/>
              Mood
            </Text>
            <Text color="#c3f8f2">
              <Icon icon={<ElectricBolt sx={{ color: "#c3f8f2" }} fontSize="large"/>}/>
              Energy
            </Text>
            <Text color="#ffc9cf">
              <Icon icon={<DirectionsRun sx={{ color: "#ffc9cf" }} fontSize="large"/>}/>
              Activity
            </Text>
          </TrendsColumn>
        </RightWrapper>
      </Page>
    );
  }
};