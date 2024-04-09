import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUMUser($input: UMUserCreateInput!) {
    createUMUser(input: $input) {
      did
      worker_sid
      twilio_attributes_raw
      zero_out_enabled
      self_service_ind
      voicemail_recording_url
      name_recording_url
      operating_unit_sid
      inactive_date
      inactive_forward_to
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUMUser($identifier: String!, $input: UMUserUpdateInput!, $options: UMUserUpdateOptionsInput) {
    updateUMUser(identifier: $identifier, input: $input, options: $options) {
      did
      worker_sid
      twilio_attributes_raw
      zero_out_enabled
      self_service_ind
      voicemail_recording_url
      name_recording_url
      operating_unit_sid
      inactive_date
      inactive_forward_to
      last_updated_by
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUMUser($identifier: String!, $options: UMUserDeleteOptionsInput) {
    deleteUMUser(identifier: $identifier, options: $options) {
      pk
      sk
      item_type
      worker_sid
    }
  }
`;
