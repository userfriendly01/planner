import { gql } from "@apollo/client";

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
        backup_workers
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
