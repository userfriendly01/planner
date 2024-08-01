import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import { UMUserTwilioAttributes } from 'globals/interfaces';
import {
    GET_USER_SKILLS,
}from "globals/graphql";
import {
    UMUser
}from "globals/interfaces";

import { logger } from "utils/logger";

const _ = require("lodash");

export const getAttributesToResetDefaultSkills = (attributes : UMUserTwilioAttributes) => {
    const defaultSkills = getValidSkillsObject(attributes.default_skills);
    const currentSkills = getValidSkillsObject(attributes.routing);
    const currentDisabledSkills = getValidSkillsObject(attributes.disabled_skills);
    const newRoutingSkills = { 
      ...currentSkills,
      ...defaultSkills
    }; //the routing attributes object will be getting added to in the future and we want to make sure the other attributes besides "skill and levels" remain in the attributes object
  
    const disabledSkills = { ...currentDisabledSkills };
  
    // remove from disabledSkills records that exist in defaultSkills
    const skillsToRemoveFromDisabledSkills = currentDisabledSkills.skills.filter((skill : string) => defaultSkills.skills.includes(skill));
    console.log("skills to remove", skillsToRemoveFromDisabledSkills);
    disabledSkills.skills = currentDisabledSkills.skills.filter((skill : string) => !skillsToRemoveFromDisabledSkills.includes(skill));
    skillsToRemoveFromDisabledSkills.forEach((skill : string) => {
      delete disabledSkills.levels[skill];
    });
    // add to disabledSkills records that exist in currentSkills but are NOT in defaultSkills
    const skillsToAddToDisabledSkills = currentSkills.skills.filter((skill : string) => !defaultSkills.skills.includes(skill));
    skillsToAddToDisabledSkills.forEach((skill : string) => {
      disabledSkills.skills.push(skill);
      const skillLevel = currentSkills.levels[skill];
      if (skillLevel) {
        disabledSkills.levels[skill] = skillLevel;
      }
    });
  
    return {
        routing: newRoutingSkills,
        disabled_skills: disabledSkills
    };
};

export const getValidSkillsObject = (skillsObject : any) => {
    const spreadObject = typeof skillsObject === "object" ? skillsObject : {};
    const validObject = {
      ...spreadObject,
      skills: [],
      levels: {}
    };
    if (_.isPlainObject(skillsObject)) {
      if (_.isArray(skillsObject.skills)) {
        skillsObject.skills.forEach((skill : string) => validObject.skills.push(skill));
      }
      if (_.isPlainObject(skillsObject.levels)) {
        Object.entries(skillsObject.levels).forEach(([key, value]) => validObject.levels[key] = value);
      }
    }
    return validObject;
};

  
export const shouldWorkerBeUpdatedToDefaultSkills = (attributes : UMUserTwilioAttributes) => {
    const currentSkills = getValidSkillsObject(attributes.routing);
    const defaultSkills = getValidSkillsObject(attributes.default_skills);
    console.log("current skills", currentSkills);
    console.log("default skills", defaultSkills);
    if (defaultSkills.skills.length > 0) {
      if (_.isEqual(currentSkills.skills.sort(), defaultSkills.skills.sort()) && _.isEqual(currentSkills.levels, defaultSkills.levels)) {
        return {
          reason: "Worker default_skills is equal to currently assigned skills",
          shouldUpdate: false
        };
      } else {
        return {
          reason: "Worker default_skills differs from currently assigned skills",
          shouldUpdate: true
        };
      }
    } else {
      return {
        reason: "No default_skills attribute exists on worker",
        shouldUpdate: false
      };
    }
};


export const getUserSkills = async (identifier: string): Promise<UMUser> => {
    const {
        errors, data
    }  = await apolloClient.query<{ user: UMUser }>({
        query: GET_USER_SKILLS,
        variables: {
        identifier
        }
    });

    if (errors?.length) {
        logger.error("Failed to fetch user from graph", { errors });
        throw errors;
    }

    return data.user;
};