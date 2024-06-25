import {
  UMTwilioAttributeSkills,
  UMUser,
  UMUserTwilioAttributes
} from "globals/interfaces";
import {
  Skill, SkillFormState,
  TimeOfDayRequestObject
} from "callflowmanagement/Skills.Interfaces";
import _ from "lodash";

import React from "react";
import styled from "styled-components";
import { logger } from "utils/logger";
import { isNotEmptyString } from "utils";

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

export const getTargetExpression = (name: string): string => `routing.skills HAS "${name}"`;

export const isTaskQueueError = (skillForm: SkillFormState, name: string): boolean => {
  const skillTargetExpression = getTargetExpression(name);

  return (skillForm.taskQueue.sid && skillForm.taskQueue.sid.length > 0) &&
    (name && name.length > 0) && skillForm.taskQueue.target_workers !== skillTargetExpression ? true : false;
};

const areTimeOfDaysValid = (timeOfDays: TimeOfDayRequestObject[], virtualHold = false) => {
  return timeOfDays.length === 7 && timeOfDays.every(tod => tod.dayOfWeekId && tod.timeOfDayId) && (virtualHold ? timeOfDays.every(tod => tod.vhTimeOfDayId) : true);
};

export const isSkillFormValid = (skills: Skill[], skillForm: SkillFormState): boolean => {
  const isNameValid = isNotEmptyString(skillForm.name) && !skills.some(s => s.name === skillForm.name);
  const areProfilesSelected = skillForm.profileIds.length;
  const areLevelsValid = (skillForm.levels.min && skillForm.levels.max) || (!skillForm.levels.min && !skillForm.levels.max) ? true : false;
  const isTaskQueueValid = skillForm.taskQueue.isNew ? isNotEmptyString(skillForm.taskQueue.friendly_name) &&
  skillForm.taskQueue.operating_unit_sid : skillForm.taskQueue.sid && !isTaskQueueError(skillForm, skillForm.name);
  return isNameValid && areProfilesSelected && isTaskQueueValid && areTimeOfDaysValid(skillForm.timeOfDays) &&
  typeof skillForm.applicationId === "number" && areLevelsValid;
};

export const areVhFieldsValid = (skillForm: SkillFormState, setMissingFields: (fields: string[]) => void): boolean => {
  const isVhFieldSelected = isNotEmptyString(skillForm.vhCallTarget) || isNotEmptyString(skillForm.vhThreshold) ||
  skillForm.timeOfDays.some(tod => tod.vhTimeOfDayId);

  const missingFields: string[] = [];
  if(isVhFieldSelected) {
    !isNotEmptyString(skillForm.vhCallTarget) && missingFields.push("vhCallTarget");
    !isNotEmptyString(skillForm.vhThreshold) && missingFields.push("vhThreshold");

    const requiredDays = [1, 2, 3, 4, 5, 6, 7];

    requiredDays.forEach((d: number) => {
      const timeOfDayRecord = skillForm.timeOfDays.find(tod => tod.dayOfWeekId !== d);
      !timeOfDayRecord || !timeOfDayRecord.vhTimeOfDayId && missingFields.push(`vhTimeOfDay.${d}`);
    });
  }

  setMissingFields(missingFields);

  logger.error("Early Return on Missing Fields", { missingFields }, false);
  return !missingFields.length;
};

export const identifyImpactedWorkers = (users: UMUser[], skills: Skill[]): Partial<UMUser>[] => {
  let impactedWorkers: UMUser[] = [];

  const cleanupWorker = (user: UMUser): Partial<UMUser> => {
    const skillNames = skills.map(s => s.name);
    const formattedWorker: UMUser = JSON.parse(JSON.stringify(user));

    if(formattedWorker.attributes.routing){
      formattedWorker.attributes.routing.skills = formattedWorker.attributes.routing?.skills?.filter((s => !skillNames.includes(s)));
    }
    if(formattedWorker.attributes.default_skills){
      formattedWorker.attributes.default_skills.skills = formattedWorker.attributes.default_skills?.skills?.filter((s => !skillNames.includes(s)));
    }
    if(formattedWorker.attributes.disabled_skills){
      formattedWorker.attributes.disabled_skills.skills = formattedWorker.attributes.disabled_skills?.skills?.filter((s => !skillNames.includes(s)));
    }

    skillNames.forEach(n => {
      if (formattedWorker.attributes.routing?.levels && formattedWorker.attributes.routing?.levels[n]) { formattedWorker.attributes.routing.levels[n]= null; }
      if (formattedWorker.attributes.default_skills?.levels && formattedWorker.attributes.default_skills?.levels[n]) { formattedWorker.attributes.default_skills.levels[n] = null; }
      if (formattedWorker.attributes.disabled_skills?.levels && formattedWorker.attributes.disabled_skills?.levels[n]) { formattedWorker.attributes.disabled_skills.levels[n] = null; }
    });

    return {
      sid: formattedWorker.sid,
      attributes: {
        routing: formattedWorker.attributes.routing,
        default_skills: formattedWorker.attributes.default_skills,
        disabled_skills: formattedWorker.attributes.disabled_skills
      }
    };
  };

  impactedWorkers = users.filter(w => skills.some(s => JSON.stringify(w).includes(s.name)));
  console.log("BEFORE CLEANUP", impactedWorkers.slice());
  return impactedWorkers.map(w => cleanupWorker(w));
};

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