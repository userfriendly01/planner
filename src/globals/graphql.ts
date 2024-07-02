import { gql } from "@apollo/client";
import { GraphData } from "globals/interfaces";

const userAttributes = `
  pk
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
      backup_workers
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
          sid: worker_sid
          inactiveDate: inactive_date
          attributes: twilio_attributes {
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

export const CREATE_SKILL_GROUP = gql`
  mutation createUMSkillGroup($input: UMSkillGroupCreateInput!) {
    skillGroup: createUMSkillGroup(input: $input) {
        cancellationReasons
        nextToken
    }
  }
`;

export const UPDATE_SKILL_GROUP = gql`
  mutation updateUMSkillGroup($id: ID!, $input: UMSkilGroupUpdateInput!) {
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

export const CREATE_SOFTPHONE_CONFIG = gql`
  mutation createUMSoftphoneConfiguration($input: UMSoftphoneConfigurationCreateInput!) {
    profile: createUMSoftphoneConfiguration(input: $input) {
        cancellationReasons
        nextToken
    }
  }
`;

export const UPDATE_SOFTPHONE_CONFIG = gql`
  mutation updateUMSoftphoneConfiguration($profile_id: Int!, $input: UMSoftphoneConfigurationUpdateInput!) {
    profile: updateUMSoftphoneConfiguration(profile_id: $profile_id, input: $input) {
        cancellationReasons
        nextToken
    }
  }
`;

export const DELETE_SOFTPHONE_CONFIG = gql`
  mutation deleteUMSoftphoneConfiguration($profile_id: Int!) {
    profile: deleteUMSoftphoneConfiguration(profile_id: $profile_id) {
        cancellationReasons
        nextToken
    }
  }
`;

export const CREATE_DIAL_LIST_ENTRY = gql`
  mutation createUMQuickDialNumber($input: UMQuickDialNumberCreateInput!) {
    dialListEntry: createUMQuickDialNumber(input: $input) {
        pk
        sk
        profile_id
        id
    }
  }
`;

export const UPDATE_DIAL_LIST_ENTRY = gql`
  mutation updateUMQuickDialNumber($profile_id: Int!, $id: ID!, $input: UMQuickDialUpdateInput!) {
    dialListEntry: updateUMQuickDialNumber(profile_id: $profile_id, id: $id, input: $input) {
        pk
        sk
        profile_id
        id
    }
  }
`;

export const DELETE_DIAL_LIST_ENTRY = gql`
  mutation deleteUMQuickDialNumber($profile_id: Int!, $id: ID!) {
    dialListEntry: deleteUMQuickDialNumber(profile_id: $profile_id, id: $id) {
        pk
        sk
        profile_id
        id
    }
  }
`;


export const CREATE_DIRECTORY_ENTRY = gql`
  mutation createUMDirectoryNumber($input: UMDirectoryNumberCreateInput!) {
    directoryEntry: createUMDirectoryNumber(input: $input) {
        pk
        sk
        profile_id
        id
    }
  }
`;

export const UPDATE_DIRECTORY_ENTRY = gql`
  mutation updateUMDirectoryNumber($profile_id: Int!, $id: ID!, $input: UMDirectoryNumberUpdateInput!) {
    directoryEntry: updateUMDirectoryNumber(profile_id: $profile_id, id: $id, input: $input) {
        pk
        sk
        profile_id
        id
    }
  }
`;

export const DELETE_DIRECTORY_ENTRY = gql`
  mutation deleteUMDirectoryNumber($profile_id: Int!, $id: ID!) {
    directoryEntry: deleteUMDirectoryNumber(profile_id: $profile_id, id: $id) {
        pk
        sk
        profile_id
        id
    }
  }
`;

export const CREATE_ACCESS_GROUP = gql`
  mutation CreateUMAccessGroup($input: UMAccessGroupCreateInput!) {
    accessGroup: createUMAccessGroup(input: $input) {
        pk
        sk
        access_group_name
        twilio_dashboard_url
        item_type
        id
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

export const listSoftphoneConfigs = (
  profilesNextToken?: string,
  screenpopsNextToken?: string,
  accessGroupsNextToken?: string,
  activitiesNextToken?: string,
  directoryNextToken?: string,
  dialListNextToken?: string,
  isFirstQuery?: boolean
) => {

  return gql`
    query listUMSoftphoneConfigurations {
      profiles: listUMSoftphoneConfigurations(nextToken: ${profilesNextToken}) @include(if:  ${ !!(profilesNextToken?.length || isFirstQuery) }) {
        nextToken
        items {
          pk
            sk
            item_type
            profile_id
            ou_sid
            ou_name
            profile_name
            overflow_skill
            acw_option
            acw_tags
            agnt_asst_pay
            auto_ans
            edt_policy_num
            edt_claim_num
            call_reason
            clk_to_dial
            eft_auth
            inbnd_rec
            man_outbnd_rec
            man_inbnd_rec
            outbnd_rec
            takes_paymnts
            voice_mail_trans
            fwd_to_num
            transfer_queues
            backup_workers
            call_tags {
                display_name
                options
                attribute_name
            }
        }
      }
      screenpops: listUMScreenpops(nextToken: ${screenpopsNextToken}) @include(if:  ${ !!(screenpopsNextToken?.length || isFirstQuery) }) {
        nextToken
        items {
            pk
            sk
            item_type
            id
            display_name
            attribute_name
        }
    }
    accessGroups: listUMAccessGroups(nextToken: ${accessGroupsNextToken}) @include(if:  ${ !!(accessGroupsNextToken?.length || isFirstQuery) }) {
        nextToken
        items {
            pk
            sk
            access_group_name
            twilio_dashboard_url
            item_type
            id
        }
    }
    activities: listUMActivities(nextToken: ${activitiesNextToken}) @include(if:  ${ !!(activitiesNextToken?.length || isFirstQuery) }) {
        nextToken
        items {
            pk
            sk
            activity_name
            activity_sid
            available
            item_type
        }
      }
    directoryEntries: listUMDirectoryNumbers(nextToken: ${directoryNextToken}) @include(if:  ${ !!(directoryNextToken?.length || isFirstQuery) }) {
      nextToken
      items {
          pk
          sk
          item_type
          id
          directory_num
          first_name
          last_name
          profile_id
      }
    }
    dialListEntries: listUMQuickDialNumbers(nextToken: ${dialListNextToken}) @include(if:  ${ !!(dialListNextToken?.length || isFirstQuery) }) {
        nextToken
        items {
            pk
            sk
            profile_id
            contact_num
            item_type
            contact_name
            external_num
            id
        }
      }
    }
  `;
};

export const getSoftphoneConfigRelationshipsQuery = (profileId: number) => {
  return gql`
     query GetUMSoftphoneConfiguration {
      profile: getUMSoftphoneConfiguration(profile_id: ${profileId}) {
        pk
        sk
        item_type
        profile_id
        ou_sid
        ou_name
        profile_name
        overflow_skill
        acw_option
        acw_tags
        agnt_asst_pay
        auto_ans
        edt_policy_num
        edt_claim_num
        call_reason
        clk_to_dial
        eft_auth
        inbnd_rec
        man_outbnd_rec
        man_inbnd_rec
        outbnd_rec
        takes_paymnts
        voice_mail_trans
        fwd_to_num
        transfer_queues
        access_group {
          pk
          sk
          access_group_name
          twilio_dashboard_url
          item_type
          id
          viewable_profiles
        }
        screenpops {
          pk
          sk
          item_type
          id
          display_name
          attribute_name
        }
        activities {
          pk
          sk
          activity_name
          activity_sid
          available
          item_type
        }
        call_tags {
          display_name
          options
          attribute_name
        }
    }
  }
`;
};
