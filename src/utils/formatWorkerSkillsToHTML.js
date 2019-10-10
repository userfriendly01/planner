import React from "react";
import styled from "styled-components";

const SkillsDiv = styled.div`
  font-size: .75em;
`;

const Priority = styled.span`
  color: red;
`;

export const formatWorkerSkillsToHTML = routingObj => {
  if (routingObj && routingObj.skills.length !== 0) {
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