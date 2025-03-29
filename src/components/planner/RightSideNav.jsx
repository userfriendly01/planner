/* eslint-disable react/prop-types */
import { VerticalTab } from "../planner/VerticalTab";
import React from "react";
import styled from "styled-components";

export const RightSideNav = () => {
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    position: absolute;
    right: -25px;
  `;
  return (
    <Wrapper>
      <VerticalTab color="#d3d2ff" label="JAN"/>
      <VerticalTab color="#cae4fd" label="FEB"/>
      <VerticalTab color="#d5f4fe" label="MAR"/>
      <VerticalTab color="#c3f8f2" label="APR"/>
      <VerticalTab color="#c5f7cd" label="MAY"/>
      <VerticalTab color="#e8f6c1" label="JUNE"/>
      <VerticalTab color="#fffacc" label="JULY"/>
      <VerticalTab color="#ffdec7" label="AUG"/>
      <VerticalTab color="#ffc9cf" label="SEPT"/>
      <VerticalTab color="#f7d1e8" label="OCT"/>
      <VerticalTab color="#fadaff" label="NOV"/>
      <VerticalTab color="#e1c4f8" label="DEC"/>
    </Wrapper>
  );
};
