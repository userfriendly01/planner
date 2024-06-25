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


export const LIST_SOFTPHONE_CONFIGURATIONS: GraphData = {
  query: gql`
    query listUMSoftphoneConfigurations($nextToken: String) {
      profiles: listUMSoftphoneConfigurations(nextToken: $nextToken) {
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
        nextToken
      }
    }
`,
  responsePath: "profiles"
};

export const GET_SOFTPHONE_CONFIGURATION_RELATIONSHIPS: GraphData = (
  profile_id: number,
  accessGroupNextToken: string | null,
  activityNextToken: string | null,
  directoryListNextToken: string | null,
  dialListListNextToken: string | null,
  dialListListNextToken: string | null,

  queryCount: number
) => {
  return gql`
  query GetSoftphoneConfigurationRelationships {
    getUMAccessGroupByProfile(profile_id: null) {
        pk
        sk
        access_group_name
        twilio_dashboard_url
        item_type
        id
        viewable_profiles
    }
    queryUMActivitiesByProfile(profile_id: null) {
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
    queryUMDirectoryNumbersByProfile(profile_id: null, nextToken: null) {
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
    queryUMQuickDialNumbersByProfile(profile_id: null, nextToken: null) {
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