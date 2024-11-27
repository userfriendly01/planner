import { gql } from "@apollo/client";
import { GraphData } from "globals/interfaces";

const userAttributes = `
  pk
  sk
  ttl
  did
  worker_sid
  twilio_attributes {
    unique_id
    agent_id
    contact_uri
    n_number
    full_name
    emp_first_name
    emp_last_name
    profile_id
    office_location_name
    office_location_number
    manager
    manager_first_name
    manager_last_name
    manager_n_number
    email
    email_address
    caller_id
    extension
    department_id
    department_name
    primary_dept_name
    primary_dept_number
    routing {
      skills
      levels
      team
      caller_states
      sales_assoc_workers
      backup_workers
      backup_workers_active
    }
    default_skills {
      skills
      levels
    }
    disabled_skills {
      skills
      levels
    }
    agent_attribute_1
  }
  zero_out_enabled
  self_service_ind
  operating_unit_sid
  inactive_date
  inactive_forward_to
`;

export const GET_USER = gql`
  query getUMUser($identifier: String!) {
    user: getUMUser(identifier: $identifier) {
      ttl
      sid: worker_sid
      twilio_attributes {
        profile_id
      }
    }
  }
`;

export const LIST_USER_RECORDS: GraphData = {
  type: "listUMUserRecords",
  query: gql`
    query listUMUserRecords($n_number: String) {
      listUMUserRecords: listUMUserRecords(n_number: $n_number) {
        items {
          pk
          sk
          item_type
          sid: worker_sid
          inactiveDate: inactive_date
          attributes: twilio_attributes {
              profile_id
          }
        }
      }
    }
  `,
  responsePaths: ["listUMUserRecords"]
};

export const LIST_USERS: GraphData = {
  type: "users",
  query: gql`
    query listUMUsers($nextToken: String) {
      users: listUMUsers(nextToken: $nextToken) {
        items {
          ${userAttributes}
        }
        nextToken
      }
    }
  `,
  responsePaths: ["users"]
};

export const LIST_INACTIVE_USERS: GraphData = {
  type: "inactiveusers",
  query: gql`
    query listUMUsers($nextToken: String) {
      inactiveusers: listUMUsers(termed_users: true, nextToken: $nextToken) {
        items {
          ${userAttributes}
        }
        nextToken
      }
    }
  `,
  responsePaths: ["inactiveusers"]
};

export const CREATE_USER = gql`
  mutation createUMUser($input: UMUserCreateInput!) {
    user: createUMUser(input: $input) {
      ${userAttributes}
      subscription_update
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUMUser($identifier: String!, $input: UMUserUpdateInput!, $options: UMUserUpdateOptionsInput) {
    user: updateUMUser(identifier: $identifier, input: $input, options: $options) {
      ${userAttributes}
      subscription_update
    }
  }
`;

export const SUBSCRIBE_CREATE_USER = `
  subscription SubscribeCreate {
    item: onCreateUMUser {
      ${userAttributes}
      subscription_update
    }
  }
`;

export const SUBSCRIBE_UPDATE_USER = `
  subscription SubscribeUpdate {
    item: onUpdateUMUser(subscription_update: true) {
      ${userAttributes}
      subscription_update
    }
  }
`;

export const SUBSCRIBE_DELETE_USER = `
  subscription SubscribeDelete {
    item: onDeleteUMUser {
      ${userAttributes}
      subscription_update
    }
  }
`;