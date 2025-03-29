/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import styled from "styled-components";
import january1 from "../../assets/images/january_1.png";
import january2 from "../../assets/images/january_2.png";
import february1 from "../../assets/images/february_1.png";
import february2 from "../../assets/images/february_2.png";
import march1 from "../../assets/images/march_1.png";
import march2 from "../../assets/images/march_2.png";
import april1 from "../../assets/images/april_1.png";
import april2 from "../../assets/images/april_2.png";
import may1 from "../../assets/images/may_1.png";
import may2 from "../../assets/images/may_2.png";
import june1 from "../../assets/images/june_1.png";
import june2 from "../../assets/images/june_2.png";
import july1 from "../../assets/images/july_1.png";
import july2 from "../../assets/images/july_2.png";
import august1 from "../../assets/images/august_1.png";
import august2 from "../../assets/images/august_2.png";
import september1 from "../../assets/images/sept_1.png";
import september2 from "../../assets/images/sept_2.png";
import october1 from "../../assets/images/oct_1.png";
import october2 from "../../assets/images/oct_2.png";
import november1 from "../../assets/images/november_1.png";
import november2 from "../../assets/images/november_2.png";
import december1 from "../../assets/images/december_1.png";
import december2 from "../../assets/images/december_2.png";


const LeftCalendar = styled.img`
  height: 85%;
  width: 450px;
  align-self: end;
`;

const RightCalendar = styled.img`
  height: 84%;
  width: 300px;
  margin-top: 61px;
  align-self: baseline;
`;

const RightWrapper = styled.div`
  display: flex;
  align-self: baseline;
`;

const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 180px;
  justify-content: space-between;
  margin: 10px;
  align-items: center;
  height: 60%;
  align-self: center;
`;

const Button = styled.button`
  width: 150px;
  background-color: ${props => props.color};
  height: 40px;
  border: none;
  border-radius: 17px;
  border: 1px solid grey;
  font-family: Optima, sans-serif;
`;

export const MonthIntro = ({
  side
}) => {
  if(side === "L"){
    return (
      <Page>
        <Header>DECEMBER</Header>
        <LeftCalendar alt="calendar" src={december1} />
      </Page>
    );
  }

  if(side === "R"){
    return (
      <Page>
        <RightWrapper>
          <RightCalendar alt="calendar" src={december2} />
          <LinkColumn>
            <Button color="#cae4fd">HABITS</Button>
            <Button color="#c3f8f2">WEIGHT</Button>
            <Button color="#c5f7cd">MEDICATION</Button>
            <Button color="#ffdec7">TRENDS</Button>
            <Button color="#f7d1e8">OVERVIEW</Button>
          </LinkColumn>
        </RightWrapper>
      </Page>
    );
  }
};