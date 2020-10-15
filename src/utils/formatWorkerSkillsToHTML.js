import React from "react";
import styled from "styled-components";

const Priority = styled.span`
  color: #28A3AF;
`;

const SkillsDiv = styled.div`
  border-color: #C0BFC0;
  border-style: solid;
  border-radius: 5px;
  border-width: 2px;
  font-size: .85em;
  font-weight: 800;
  margin: 2;
  padding: 1 3;
`;

export const formatWorkerSkillsToHTML = routingObj => {
  if (routingObj && Array.isArray(routingObj.skills) && routingObj.skills.length > 0) {
    return routingObj.skills.map((skill, index) => {
      if (routingObj.levels && routingObj.levels[skill]) {
        return <SkillsDiv key={index}>{`${skill} - `}<Priority>{`${routingObj.levels[skill]}`}</Priority></SkillsDiv>;
      }
      return <SkillsDiv key={index}>{skill}</SkillsDiv>;
    });
  } else {
    return null;
  }
};