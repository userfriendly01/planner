import { gql } from "@apollo/client";
import { GraphData } from "globals/interfaces";

export const LIST_RULES: GraphData = {
  type: "rules",
  query: gql`
   query ListRules(
    $rulesBool: Boolean!,
    $rulesNextToken: String,
    $applicationsBool: Boolean!,
    $applicationsNextToken: String,
    $ruleRelationshipsBool: Boolean!,
    $ruleRelationshipsNextToken: String,
   ) {
    rules: listRules(nextToken: $rulesNextToken) @include(if: $rulesBool) {
      nextToken
      items {
        pk
        sk
        id
        item_type
        description
        mappings {
          logic
          actions
        }
      }
    }
    applications: listApplications(nextToken: $applicationsNextToken) @include(if: $applicationsBool) {
      nextToken
      items {
        pk
        sk
        azure_app_id
        name
      }
    }
    ruleRelationships: listRulesToApplications(nextToken: $ruleRelationshipsNextToken) @include(if: $ruleRelationshipsBool) {
      nextToken
      items {
        pk
        sk
        id
      }
    }
  }
`,
  responsePaths: ["rules", "applications", "ruleRelationships"]
};