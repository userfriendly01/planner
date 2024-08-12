import { gql } from "@apollo/client";

export const CREATE_SKILL = gql`
  mutation createUMSkill($input: UMSkillCreateInput!) {
    skill: createUMSkill(input: $input) {
        pk
    }
  }
`;

export const UPDATE_SKILL = gql`
  mutation updateUMSkill($skill_id: String!, $input: UMSkillUpdateInput!) {
    skill: updateUMSkill(skill_id: $skill_id, input: $input) {
        cancellationReasons
        nextToken
    }
  }
`;

export const UPDATE_SKILL_RELATIONSHIPS = gql`
  mutation updateUMSoftphoneConfigSkills($profile_id: Int!, $input: UMSoftphoneConfigSkillsUpdateInput!) {
    updateUMSoftphoneConfigSkills(profile_id: $profile_id, input: $input) {
        cancellationReasons
        nextToken
    }
  }
`;

export const DELETE_SKILL = gql`
  mutation deleteUMSkill($skill_id: String!) {
    skill: deleteUMSkill(skill_id: $skill_id) {
        cancellationReasons
        nextToken
    }
  }
`;

export const getUMSkills = (
  skillsNextToken?: string,
  skillProfilesNextToken?: string,
  skillGroupsNextToken?: string,
  skillGroupsProfilesNextToken?: string,
  isFirstQuery?: boolean
) => {
  return gql`
  query ListUMSkills {
    skills: listUMSkills(nextToken: ${skillsNextToken}) @include(if:  ${ !!(skillsNextToken?.length || isFirstQuery) }) {
      nextToken
      items {
        pk
        sk
        skill_id
        task_queue_sid
        task_queue_name
        levels
      }
    }
    skillProfiles: listUMSoftphoneConfigToSkillItems(nextToken: ${skillProfilesNextToken}) @include(if:  ${ !!(skillProfilesNextToken?.length || isFirstQuery) }) {
      nextToken
      items {
        pk
        skill_id
      }
    }
    skillGroups: listUMSkillGroups(nextToken: ${skillGroupsNextToken}) @include(if:  ${ !!(skillGroupsNextToken?.length || isFirstQuery) }) {
      nextToken
      items {
        pk
        sk
        skill_group_name
        id
        skills
      }
    }
    skillGroupProfiles: listUMSkillGroupToSkillItems(nextToken: ${skillGroupsProfilesNextToken}) @include(if:  ${ !!(skillGroupsProfilesNextToken?.length || isFirstQuery) }) {
      nextToken
      items {
        pk
        sk
        skill_id
        task_queue_sid
        task_queue_name
        levels
      }
    }
  }
`;
};