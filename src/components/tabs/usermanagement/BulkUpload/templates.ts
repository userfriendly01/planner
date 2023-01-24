import { calabrioTimeZones } from "utils";

export const getCreateTemplates: any = (state: any): any => {
  return {
    CREATE_TRITON_USER: [
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
      }
    ],
    CREATE_CALABRIO_QM_USER: [
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
        field: "timeZone",
        name: "Time Zone",
        type: "string",
        description: "Time Zone of the Calabrio User",
        required: "Y",
        example: "America/New_York",
        options: calabrioTimeZones.map((t: any) => t.label)
      }
    ]
  };
};