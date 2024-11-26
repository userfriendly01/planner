import { gql } from "@apollo/client";
import { GraphData } from "globals/interfaces";

export const LIST_RULES: GraphData = {
  query: gql`
   query ListRules($nextToken: String) {
    rules: listRules(nextToken: $nextToken) {
      nextToken
      items {
        pk
        sk
        id
        item_type
        description
        variables
        mappings {
          logic
          actions {
              key
              value
          }
        }
      }
    }
  }
`,
  responsePath: "rules"
};

export const LIST_APPLICATIONS: GraphData = {
  query: gql`
   query ListApplications($nextToken: String) {
    applications: listApplications(nextToken: $nextToken) {
        nextToken
        items {
          pk
          sk
          azure_app_id
          name
      }
    }
  }
`,
  responsePath: "applications"
};

export const LIST_RULE_RELATIONSHIPS: GraphData = {
  query: gql`
   query ListRulesToApplications($nextToken: String) {
    relationships: listRulesToApplications(nextToken: $nextToken) {
      nextToken
      items {
        pk
        sk
        id
      }
    }
  }
`,
  responsePath: "relationships"
};