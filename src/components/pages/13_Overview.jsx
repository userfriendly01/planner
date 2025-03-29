/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import { Divider } from "@mui/material";
import styled from "styled-components";
import circle from "../../assets/images/overview_wheel.png";

const OverviewCircle = styled.img`
  height: 350px;
  width: 350px;
  margin-top: 25px;
`;

const Text = styled.div`
  font-family: Optima, sans-serif;
  display: flex;
  margin: 5px 1px 15px 8px;
  text-align: center;
  font-size: 13px;
`;

const Line = () => ((
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

export const Overview = ({ side }) => {
  if(side === "L"){
    return (
      <Page>
        <Header>OVERVIEW</Header>
        <Text>WHAT WERE MY BIGGEST WINS?</Text>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <OverviewCircle alt="overview circle" src={circle} />
      </Page>
    );
  }

  if(side === "R"){
    return (
      <Page>
        <div style={{
          height: "61px"
        }}/>
        <Text>WHAT DID I DO THAT POSITIVELY AFFECTED MY WELLBEING THIS MONTH?</Text>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Text>WHAT MADE ME FEEL HAPPY THIS MONTH?</Text>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Text>HOW WILL I MAKE NEXT MONTH BETTER?</Text>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
      </Page>
    );
  }
};