export const createTemplates: any = {
  CREATE_TRITON_USER: [
    {
      field: "nNumber",
      name: "N Number",
      type: "string",
      description: "Agents N Number",
      required: "Y",
      example: "n0263786",
      options: []
    },
    {
      field: "profileId",
      name: "Profile Id",
      type: "number",
      description: "Profile Id",
      required: "Y",
      example: 3,
      options: []
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
      options: []
    },
    {
      field: "calabrioGroup",
      name: "Calabrio Group",
      type: "string",
      description: "Parent Group (Must already be created in Calabrio)",
      required: "Y",
      example: "Default Group",
      options: []
    },
    {
      field: "calabrioTeam",
      name: "Calabrio Team",
      type: "string",
      description: "Team (Must already be created in Calabrio)",
      required: "Y",
      example: "Default Team",
      options: []
    },
    {
      field: "timeZone",
      name: "Time Zone",
      type: "string",
      description: "Time Zone of the Calabrio User",
      required: "Y",
      example: "America/New_York",
      options: []
    }
  ]
};