/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";

const CircleBase = styled.div`
  width: ${props => props.width || "50px"};
  height:${props => props.height || "50px"};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: .5px solid black;
  border-radius: 50%;
`;

export const Circle = ({
  width,
  height,
  color
}) => {
  return (
    <>
      <CircleBase width={width} height={height} color={color} />
    </>
  );
};