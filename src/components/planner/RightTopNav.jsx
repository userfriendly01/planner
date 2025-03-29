/* eslint-disable react/prop-types */
import { HorizontalTab } from "../planner/HorizontalTab";
import React from "react";
import styled from "styled-components";

export const RightTopNav = () => {
  const Wrapper = styled.div`
    display: flex;
    width: 100%;
    position: absolute;
    top: -21px;
  `;
  return (
    <Wrapper>
      <HorizontalTab color="#c3f8f2" label="MEALS"/>
      <HorizontalTab color="#c5f7cd" label="WORKOUTS"/>
      <HorizontalTab color="#e8f6c1" label="ROUTINE"/>
      <HorizontalTab color="#fffacc" label="NOTES"/>
    </Wrapper>
  );
};
