/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import styled from "styled-components";

const MonthsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-left: 20px;
`;

const MonthWrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: solid 1px black;
    height: 120px;
    width: 115px;
    border-radius: 18%;
    margin: 10px 17px;
    position: relative;
    background-color: white;
    font-family: Optima, sans-serif;
    font-size: 10px;
    z-index: 2;
    padding-top: 8px;
    padding-left: 8px;
`;

const MonthLabel = styled.div`
  writing-mode: vertical-lr;
  rotate: 180deg;
  position: absolute;
  height: 120px;
  border-radius: 17px;
  width: 30px;
  font-family: Optima, sans-serif;
  align-content: center;
  text-align: center;
  top: 10%;
  left: -7px;
`;

const Text = styled.div`
  font-family: Optima, sans-serif;
  display: flex;
  margin: 5px 1px 1px 8px;
`;

export const IndexPage = ({ side }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const colors = ["#d3d2ff", "#cae4fd", "#d5f4fe", "#c3f8f2", "#c5f7cd", "#c3f8f2", "#fffacc", "#ffdec7", "#ffc9cf", "#f7d1e8", "#fadaff", "#e1c4f8"];

  if(side === "L"){
    return (
      <Page>
        <Header>INDEX PAGE</Header>
        <MonthsWrapper>
          {months.map((m, i) => ((
            <div style={{ position: "relative" }} key={m}>
              <MonthLabel style={{ backgroundColor: colors[i] }}>
                {m}
              </MonthLabel>
              <MonthWrapper>
                <Text>{"\u2022"} CALENDAR</Text>
                <Text>{"\u2022"} HABITS</Text>
                <Text>{"\u2022"} WEIGHT</Text>
                <Text>{"\u2022"} MEDICATION</Text>
                <Text>{"\u2022"} TRENDS</Text>
                <Text>{"\u2022"} OVERVIEW</Text>
              </MonthWrapper>
            </div>
          )))
          }
        </MonthsWrapper>
      </Page>
    );
  }

  if(side === "R"){
    return (
      <Page><Header>TO DO</Header></Page>
    );
  }
};