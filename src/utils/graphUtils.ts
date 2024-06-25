import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import { areSkillsDifferent } from "utils/skillsUtils";
import {
  Action,
  DBList,
  UMOffice,
  UMManager,
  UMUser,
  GraphData,
  UMUserTwilioAttributes
}from "globals/interfaces";
import {
  LIST_MANAGERS,
  LIST_OFFICES,
  LIST_USERS
}from "globals/graphql";
import {
  logger
} from "utils/logger";

type PaginationType = UMOffice | UMManager | UMUser;

export const getGraphData = (type: string) => {
  switch (type) {
    case "UMUser":
      return LIST_USERS;
    case "UMManager":
      return LIST_MANAGERS;
    case "UMOffice":
      return LIST_OFFICES;
    default:
      throw `Type of ${type} is not a valid list type`;
  }
};

export const getPaginatedResults = async (type: string, dispatch: (action: Action) => void, formatResults?: (items: PaginationType[]) => PaginationType[], callBack?: VoidFunction): Promise<void> => {
  const graph: GraphData = getGraphData(type);
  let isFirstQuery = true;
  const getPageResults = async (nextToken?: string): Promise<VoidFunction> => {
    try {
      const { data }: any  = await apolloClient.query<{ results: DBList<PaginationType | null> }>({
        query: graph.query,
        variables: {
          nextToken
        }
      });

      const items = data[graph.responsePath]?.items;
      const formattedData = formatResults ? formatResults(items) : items;

      dispatch(({
        type: "loadPaginatedResults",
        payload: {
          type,
          results: formattedData,
          isFirstPage: isFirstQuery
        }
      }));

      if(data[graph.responsePath]?.nextToken){
        isFirstQuery = false;
        return getPageResults(data[graph.responsePath]?.nextToken);
      } else {
        if(callBack) {
          callBack();
        }
        return;
      }
    } catch(error) {
      logger.error(`Error thrown getting paginated results for ${type}`, error);
      return Promise.reject(error);
    }
  };

  await getPageResults();

  return;
};

//The following functions are temporary until we align the app & reducers to the new graph

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