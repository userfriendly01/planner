import { gql } from "@apollo/client";

const userAttributes = `
  directDialNum: did
  sid: worker_sid
  twilio_attributes_raw
  zeroOutEnabled: zero_out_enabled
  selfServiceInd: self_service_ind
  operatingUnitSid: operating_unit_sid
  inactiveDate: inactive_date
  inactiveForwardTo: inactive_forward_to
`;

export const GET_USER = gql`
  query getUMUser($identifier: String!) {
    user: getUMUser(identifier: $identifier) {
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
