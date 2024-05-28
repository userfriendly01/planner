import { gql } from "@apollo/client";
import { GraphData } from "globals";

const userAttributes = `
  ttl
  did
  sid: worker_sid
  attributes: twilio_attributes {
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
  zeroOutEnabled: zero_out_enabled
  selfServiceInd: self_service_ind
  operatingUnitSid: operating_unit_sid
  inactiveDate: inactive_date
  inactiveForwardTo: inactive_forward_to
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
  query: gql`
    query listUMUserRecords($n_number: String) {
      listUMUserRecords: listUMUserRecords(n_number: $n_number) {
        items {
          pk
          sk
          item_type
          worker_sid
          inactive_date
          twilio_attributes {
              profile_id
          }
        }
      }
    }
  `,
  responsePath: "listUMUserRecords"
};

export const LIST_USERS: GraphData = {
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
  responsePath: "users"
};

export const CREATE_USER = gql`
  mutation createUMUser($input: UMUserCreateInput!) {
    user: createUMUser(input: $input) {
      ${userAttributes}
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUMUser($identifier: String!, $input: UMUserUpdateInput!, $options: UMUserUpdateOptionsInput) {
    user: updateUMUser(identifier: $identifier, input: $input, options: $options) {
      ${userAttributes}
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUMUser($identifier: String!, $options: UMUserDeleteOptionsInput) {
    user: deleteUMUser(identifier: $identifier, options: $options) {
      ${userAttributes}
    }
  }
`;

export const LIST_OFFICES: GraphData = {
  query: gql`
    query listUMOffices($nextToken: String) {
      offices: listUMOffices(nextToken: $nextToken) {
        items {
          pk
          sk
          item_type
          office_num
          office_name
        }
        nextToken
      }
    }
`,
  responsePath: "offices"
};

export const CREATE_OFFICE = gql`
  mutation createUMOffice($input: UMOfficeCreateInput!) {
    office: createUMOffice(input: $input) {
      pk
      sk
      item_type
      office_num
      office_name
    }
  }
`;

export const LIST_MANAGERS: GraphData = {
  query: gql`
    query listUMManagers($nextToken: String) {
      managers: listUMManagers(nextToken: $nextToken) {
        items {
          pk
          sk
          item_type
          manager_first_name
          manager_last_name
          profile_id
          manager_n_num
          calabrio_team_ids
        }
        nextToken
      }
    }
`,
  responsePath: "managers"
};

export const CREATE_MANAGER = gql`
  mutation createUMManager($input: UMManagerCreateInput!) {
    manager: createUMManager(input: $input) {
      pk
      sk
      item_type
      manager_first_name
      manager_last_name
      profile_id
      manager_n_num
      calabrio_team_ids
    }
  }
`;


export const UPDATE_MANAGER = gql`
  mutation updateUMManager($n_number: String!, $input: UMManagerUpdateInput!) {
    manager: updateUMManager(n_number: $n_number, input: $input) {
      pk
      sk
      item_type
      manager_first_name
      manager_last_name
      profile_id
      manager_n_num
      calabrio_team_ids
    }
  }
`;

export const DELETE_MANAGER = gql`
  mutation deleteUMManager($n_number: String!) {
    manager: deleteUMManager(n_number: $n_number) {
      pk
      sk
      item_type
      manager_first_name
      manager_last_name
      profile_id
      manager_n_num
      calabrio_team_ids
    }
  }
`;