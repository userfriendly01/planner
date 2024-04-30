import { gql } from "@apollo/client";

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

export const LIST_USERS = gql`
  query listUMUsers($nextToken: String) {
    users: listUMUsers(nextToken: $nextToken) {
      items {
        ${userAttributes}
      }
      nextToken
    }
  }
`;

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
