import { gql } from "@apollo/client";

export const GET_OFFICE = gql`
    query getUMOffice($office_num: String) {
      office: getUMOffice(office_num: $office_num) {
        pk
        sk
        item_type
        office_num
        office_name
      }
    }
`;

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