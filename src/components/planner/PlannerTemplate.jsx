import binder from "../../assets/images/binder.png";
import React from "react";
import styled from "styled-components";
import { LeftTopNav } from "./LeftTopNav";
import { RightTopNav } from "./RightTopNav";
import { RightSideNav } from "./RightSideNav";
import {
  IndexPage,
  Calendar,
  Goals,
  Meals,
  Workouts,
  Routine,
  Notes,
  MonthIntro,
  Weight,
  Habits,
  Meds,
  Trends,
  Overview,
  Daily
} from "../pages/index";
import { Page } from "./Page";

const PageWrapper = styled.div`
  display: flex;
  margin: 35px;
  width: 90%;
  height: 100%
  justify-content: center;
`;

const Binder = styled.img`
  height: 665px;
  width: 50px;
`;

export const PlannerTemplate = () => {
  const CurrentLeftPage = () => <Routine side="L"/>;
  const CurrentRightPage = () => <Routine side="R"/>;
  return (
    <PageWrapper>
      <Page>
        <LeftTopNav/>
        <CurrentLeftPage/>
      </Page>
      <Binder alt="Binder" src={binder} />
      <Page>
        <RightTopNav/>
        <RightSideNav/>
        <CurrentRightPage/>
      </Page>
    </PageWrapper>
  );
};