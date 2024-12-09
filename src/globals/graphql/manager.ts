import { gql } from "@apollo/client";
import { GraphData } from "globals/interfaces";

export const LIST_MANAGERS: GraphData = {
  type: "managers",
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
          is_calabrio_team_exception
        }
        nextToken
      }
    }
`,
  responsePaths: ["managers"]
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
      is_calabrio_team_exception
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
      is_calabrio_team_exception
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
      is_calabrio_team_exception
    }
  }
`;