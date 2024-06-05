import {
  UMUser, UMUserTwilioAttributes
} from "globals/interfaces";
import { areSkillsDifferent } from "utils/skillsUtils";

export const mapWorkerToDbWorker = (worker: Partial<UMUser>): Partial<UMUser> => {
  return {
    ...worker.attributes && {
      twilio_attributes: JSON.stringify({
        ...worker.attributes,
        ...(worker.attributes.profile_id !== null &&
          worker.attributes.profile_id !== undefined && {
          agent_attribute_1: worker.attributes.profile_id
        })
      })
    },
    ...worker.did && {
      did: worker.did
    },
    ...worker.operatingUnitSid && {
      operating_unit_sid: worker.operatingUnitSid
    },
    ...(worker.zeroOutEnabled !== undefined && worker.zeroOutEnabled !== null) && {
      zero_out_enabled: worker.zeroOutEnabled
    },
    ...(worker.selfServiceInd !== undefined && worker.selfServiceInd !== null)  !== undefined && {
      self_service_ind: worker.selfServiceInd
    },
    ...worker.inactiveForwardTo && {
      inactive_forward_to: worker.inactiveForwardTo
    }
  };
};

export const mapWorkerFromTwilio = (dbWorker: UMUser): UMUser => {
  const worker = {
    ...dbWorker,
    sid: dbWorker.workerSid,
    skillsDifferent: dbWorker.attributes ? areSkillsDifferent(dbWorker.attributes) : false
  };
  delete worker.workerSid;
  if (worker.attributes?.manager_n_number) {
    worker.attributes.manager_n_number = worker.attributes.manager_n_number.toLowerCase();
  }
  //sometimes Twilio flops and cant populate full name - this will be more reliable
  if(dbWorker.attributes?.emp_first_name && dbWorker.attributes?.emp_last_name){
    worker.attributes.full_name = `${dbWorker.attributes?.emp_first_name} ${dbWorker.attributes?.emp_last_name}`;
  }
  return worker;
};

export const mapWorkerFromDbWorker = (dbWorker: UMUser): UMUser => {
  if (!dbWorker.attributes) {
    return {
      ...dbWorker,
      skillsDifferent: false
    };
  }

  const parsedAttributes = {
    ...dbWorker.attributes,
    ...dbWorker.attributes.routing && {
      routing: {
        ...dbWorker.attributes.routing,
        levels: JSON.parse(dbWorker.attributes.routing.levels as unknown as string)
      }
    },
    ...dbWorker.attributes.default_skills && {
      default_skills: {
        ...dbWorker.attributes.default_skills,
        levels: JSON.parse(dbWorker.attributes.default_skills.levels as unknown as string)
      }
    },
    ...dbWorker.attributes.disabled_skills && {
      disabled_skills: {
        ...dbWorker.attributes.disabled_skills,
        levels: JSON.parse(dbWorker.attributes.disabled_skills.levels as unknown as string)
      }
    }
  } as UMUserTwilioAttributes;

  const worker = {
    ...dbWorker,
    attributes: parsedAttributes,
    skillsDifferent: parsedAttributes ? areSkillsDifferent(parsedAttributes) : false
  };

  if (worker.attributes?.manager_n_number) {
    worker.attributes.manager_n_number = worker.attributes.manager_n_number.toLowerCase();
  }
  //sometimes Twilio flops and cant populate full name - this will be more reliable
  if(worker.attributes?.emp_first_name && worker.attributes?.emp_last_name){
    worker.attributes.full_name = `${worker.attributes?.emp_first_name} ${worker.attributes?.emp_last_name}`;
  }
  return worker;
};