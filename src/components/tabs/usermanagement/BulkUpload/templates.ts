import { calabrioTimeZones } from "utils";

export const getCreateTemplates: any = (state: any): any => {
  return {
    CREATE_TRITON_USER: {
      name: "CREATE_TRITON_USER",
      fields: [
        {
          field: "nNumber",
          name: "N Number",
          type: "string",
          description: "Agents N Number",
          required: "Y",
          example: "n0263786",
          options: null
        },
        {
          field: "profileId",
          name: "Profile Id",
          type: "number",
          description: "Profile Id",
          required: "Y",
          example: 3,
          options: state.profileContext.profiles.map((p: any) => p.profile_id)
        },
        {
          field: "managerNNumber",
          name: "Manager N Number",
          type: "string",
          description: "N Number of the Manager",
          required: "Y",
          example: "n0088625",
          options: state.managerContext.managers.map((m: any) => m.manager_n_number)
        },
        {
          field: "defaultSkills",
          name: "Default Skills",
          type: "string",
          description: "Comma delimited list of skills assigned as the Defauls Skill profile for the user. If left blank, no skills will be assigned",
          required: "N",
          example: "bscCommissions, aisgl1, blSalesL1",
          options: state.skillContext.skills.map((s: any) => s.name)
        },
        {
          field: "defaultSkillLevels",
          name: "Default Skill Levels",
          type: "string",
          description: "Comma delimited list of skill/level pairings. Skills should have a colon before the level. If left blank, skills with levels will default to 1",
          required: "N",
          example: "bscCommissions: 3, blSalesL1: 2",
          options: null
        },
        {
          field: "extension",
          name: "Extension",
          type: "string",
          description: "Comma delimited list of skill/level pairings. Skills should have a colon before the level. If left blank, skills with levels will default to 1",
          required: "N",
          example: "bscCommissions: 3, blSalesL1: 2",
          options: null
        }
      ]
    },
    CREATE_CALABRIO_QM_USER: {
      name: "CREATE_CALABRIO_QM_USER",
      fields: [
        {
          field: "nNumber",
          name: "N Number",
          type: "string",
          description: "Agents N Number",
          required: "Y",
          example: "n0263786",
          options: null
        },
        {
          field: "calabrioGroup",
          name: "Calabrio Group",
          type: "string",
          description: "Parent Group (Must already be created in Calabrio)",
          required: "Y",
          example: "Default Group",
          options: state.calabrioContext.groups.map((g: any) => g.name)
        },
        {
          field: "calabrioTeam",
          name: "Calabrio Team",
          type: "string",
          description: "Team (Must already be created in Calabrio)",
          required: "Y",
          example: "Default Team",
          options: state.calabrioContext.teams.map((t: any) => t.name)
        },
        {
          field: "roles",
          name: "Calabrio Team",
          type: "string",
          description: "Team (Must already be created in Calabrio)",
          required: "Y",
          example: "Default Team",
          options: state.calabrioContext.roles.map((r: any) => r.name)
        },
        {
          field: "timeZone",
          name: "Time Zone",
          type: "string",
          description: "Time Zone of the Calabrio User",
          required: "Y",
          example: "America/New_York",
          options: calabrioTimeZones.map((t: any) => t.label)
        }
      ]
    }
  };
};