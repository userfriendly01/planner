import { gql } from "@apollo/client";

export const UPDATE_SKILL = gql`
  mutation updateUMSkill($skill_id: String!, $input: UMSkillUpdateInput!) {
    skill: updateUMSkill(skill_id: $skill_id, input: $input) {
      keys {
        pk
        sk
      }
      cancellationReasons
      nextToken
    }
  }
`;

