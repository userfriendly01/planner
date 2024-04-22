import { UMUser } from "globals";
import { areSkillsDifferent } from "utils";

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
  const parsedAttributes = dbWorker.twilio_attributes_raw ? JSON.parse(dbWorker.twilio_attributes_raw) : null;

  const worker = {
    ...dbWorker,
    attributes: parsedAttributes,
    skillsDifferent: parsedAttributes ? areSkillsDifferent(parsedAttributes) : false
  };

  delete worker.twilio_attributes_raw;

  if (worker.attributes?.manager_n_number) {
    worker.attributes.manager_n_number = worker.attributes.manager_n_number.toLowerCase();
  }
  //sometimes Twilio flops and cant populate full name - this will be more reliable
  if(worker.attributes?.emp_first_name && worker.attributes?.emp_last_name){
    worker.attributes.full_name = `${worker.attributes?.emp_first_name} ${worker.attributes?.emp_last_name}`;
  }
  return worker;
};