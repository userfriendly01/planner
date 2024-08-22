import { gql } from "@apollo/client";

export const CREATE_SKILL_GROUP = gql`
  mutation createUMSkillGroup($input: UMSkillGroupCreateInput!) {
    skillGroup: createUMSkillGroup(input: $input) {
        cancellationReasons
        nextToken
    }
  }
`;

export const UPDATE_SKILL_GROUP = gql`
  mutation updateUMSkillGroup($id: ID!, $input: UMSkillGroupUpdateInput!) {
    skillGroup: updateUMSkillGroup(id: $id, input: $input) {
        cancellationReasons
        nextToken
    }
  }
`;

export const DELETE_SKILL_GROUP = gql`
  mutation deleteUMSkillGroup($id: ID!) {
    skillGroup: deleteUMSkillGroup(id: $id) {
        cancellationReasons
        nextToken
    }
  }
`;