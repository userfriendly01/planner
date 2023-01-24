export const createTemplates: any = {
  CREATE_TRITON_USER: [
    {
      field: "nNumber",
      name: "N Number",
      type: "string",
      description: "Agents N Number",
      required: "Y",
      example: "n0263786",
      width: "50px",
      options: [],
      wrap: true,
      textAlign: "center"
    },
    {
      field: "profileId",
      name: "Profile Id",
      type: "number",
      description: "Profile Id",
      required: "Y",
      example: 3,
      width: "50px",
      options: [],
      wrap: true,
      textAlign: "center"
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
      width: "50px",
      options: [],
      wrap: true,
      textAlign: "center"
    },
    {
      field: "calabrioGroup",
      name: "Calabrio Group",
      type: "string",
      description: "Parent Group (Must already be created in Calabrio)",
      required: "Y",
      example: "Default Group",
      width: "50px",
      options: [],
      wrap: true,
      textAlign: "center"
    },
    {
      field: "calabrioTeam",
      name: "Calabrio Team",
      type: "string",
      description: "Team (Must already be created in Calabrio)",
      required: "Y",
      example: "Default Team",
      width: "50px",
      options: [],
      wrap: true,
      textAlign: "center"
    }
  ]
};