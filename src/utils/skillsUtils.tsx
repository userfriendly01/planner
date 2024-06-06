import {
  UMTwilioAttributeSkills,
  Skill,
  UMUserTwilioAttributes
} from "globals/interfaces";
import _ from "lodash";

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

export const formatWorkerAttributeSkillsToHTML = (routingObj: any) => {
  if (routingObj && Array.isArray(routingObj.skills) && routingObj.skills.length > 0) {
    return routingObj.skills.map((skill: string, index: number) => {
      if (routingObj.levels && routingObj.levels[skill]) {
        return <SkillsDiv key={index}>{`${skill} - `}<Priority>{`${routingObj.levels[skill]}`}</Priority></SkillsDiv>;
      }
      return <SkillsDiv key={index}>{skill}</SkillsDiv>;
    });
  } else {
    return null;
  }
};

export const formatWorkerAttributeSkillsToString = (routingObj: any) => {
  if (routingObj && Array.isArray(routingObj.skills) && routingObj.skills.length > 0) {
    return routingObj.skills.map((skill: string) => {
      if (routingObj.levels && routingObj.levels[skill]) {
        return `${skill} - ${routingObj.levels[skill]}`;
      } else {
        return `${skill}`;
      }
    });
  } else {
    return "";
  }
};

export const areSkillsDifferent = (workerAttributes: UMUserTwilioAttributes): boolean => {
  const currentSkills = getValidSkillsObject(workerAttributes.routing);
  const defaultSkills = getValidSkillsObject(workerAttributes.default_skills);
  if (defaultSkills.skills.length > 0) {
    return !(_.isEqual(currentSkills.skills.sort(), defaultSkills.skills.sort()) && _.isEqual(currentSkills.levels, defaultSkills.levels));
  } else {
    return false;
  }
};

export const getValidSkillsObject = (skillsObject?: UMTwilioAttributeSkills): UMTwilioAttributeSkills => {
  const spreadSkillObject = typeof skillsObject === "object" ? skillsObject : {};
  const validObject: UMTwilioAttributeSkills = {
    ...spreadSkillObject,
    skills: [],
    levels: {}
  };
  if (_.isPlainObject(skillsObject)) {
    if (_.isArray(skillsObject.skills)) {
      skillsObject.skills.forEach((skill: string) => validObject.skills.push(skill));
    }
    if (_.isPlainObject(skillsObject.levels)) {
      Object.entries(skillsObject.levels).forEach(([key, value]) => validObject.levels[key] = value);
    }
  }
  return validObject;
};

export const formatSkillGroups = (skillsArray: Skill[]): any[] => {
  // filter through the skills that have skillGroups and group them by skillGroup
  const skillsWithGroups = skillsArray.filter(s => s.ctmSkillGroups.length > 0);

  const groups: any[] = [];
  skillsWithGroups.forEach(sk => {
    sk.ctmSkillGroups.forEach(group => {
      const groupInGroupsArray = groups.find(g => g.skillGroupId === group.skillGroupId);
      const skillCopy = JSON.parse(JSON.stringify(sk));
      delete skillCopy.ctmSkillGroups; // take off the skillGroups from this layer or we'll have neverending data
      if (groupInGroupsArray) {
        groupInGroupsArray.skills.push(skillCopy);
      } else {
        const newGroup = group;
        newGroup.skills = [skillCopy];
        groups.push(newGroup);
      }
    });
  });

  return groups;
};