import { UMUser } from "globals";
import { areSkillsDifferent } from "utils";

export const formatWorkerResponse = (response: UMUser[]): UMUser[] => {
  if (response) {
    const formattedWorkers = response.map(mapWorkerFromDbWorker);
    return formattedWorkers;
  } else {
    return [];
  }
};

export const mapWorkerToDbWorker = (worker: Partial<UMUser>): Partial<UMUser> => {
  return {
    twilio_attributes: JSON.stringify({
      ...worker.attributes,
      ...(worker.attributes.routing && {
        routing: {
          ...worker.attributes.routing,
          caller_states: worker.attributes.routing.callerStates
        }
      }),
      ...(worker.attributes.did && {
        caller_id: worker.attributes.did
      }),
      ...(worker.attributes.profile_id !== null &&
        worker.attributes.profile_id !== undefined && {
        agent_attribute_1: worker.attributes.profile_id
      })
    }),
    ...worker.directDialNum && {
      did: worker.directDialNum
    },
    ...worker.operatingUnitSid && {
      operating_unit_sid: worker.operatingUnitSid
    },
    ...worker.zeroOutEnabled !== undefined && {
      zero_out_enabled: worker.directDialNum
    },
    ...worker.selfServiceInd && {
      self_service_ind: worker.selfServiceInd
    },
    ...worker.alternateDid && {
      alternateDid: worker.alternateDid
    }
  };
};

export const mapWorkerFromDbWorker = (dbWorker: UMUser): UMUser => {
  const worker = {
    ...dbWorker,
    attributes: JSON.parse(dbWorker.twilio_attributes_raw),
    skillsDifferent: dbWorker.attributes ? areSkillsDifferent(dbWorker.attributes) : false
  };

  delete worker.twilio_attributes_raw;

  if (worker.attributes?.manager_n_number) {
    worker.attributes.manager_n_number = worker.attributes.manager_n_number.toLowerCase();
  }
  //sometimes Twilio flops and cant populate full name - this will be more reliable
  if(dbWorker.attributes?.emp_first_name && dbWorker.attributes?.emp_last_name){
    worker.attributes.full_name = `${dbWorker.attributes?.emp_first_name} ${dbWorker.attributes?.emp_last_name}`;
  }
  return worker;
};