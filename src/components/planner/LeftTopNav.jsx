/* eslint-disable react/prop-types */
import { HorizontalTab } from "../planner/HorizontalTab";
import React from "react";
import styled from "styled-components";

export const LeftTopNav = () => {
  const Wrapper = styled.div`
    display: flex;
    width: 100%;
    position: absolute;
    top: -21px;
  `;
  return (
    <Wrapper>
      <HorizontalTab color="#e1c4f8" label="INDEX"/>
      <HorizontalTab color="#d5f4fe" label="TO DO"/>
      <HorizontalTab color="#d3d2ff" label="CALENDAR"/>
      <HorizontalTab color="#cae4fd" label="GOALS"/>
    </Wrapper>
  );
};
