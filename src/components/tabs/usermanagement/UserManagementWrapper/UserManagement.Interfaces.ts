export interface View {
  value: string,
  label: string
}

export const views = {
  TRITON_USERS: {
    value: "TRITON_USERS",
    label: "Triton Users"
  },
  CALABRIO_QM_USERS: {
    value: "CALABRIO_QM_USERS",
    label: "Calabrio QM Users"
  },
  CALABRIO_WFM_USERS: {
    value: "CALABRIO_WFM_USERS",
    label: "Calabrio WFM Users"
  },
  // COMPARE_PROFILES: {
  //   value: "COMPARE_USER_PROFILES",
  //   label: "Compare User Profiles"
  // },
  ONBOARD_NEW_USER: {
    value: "ONBOARD_NEW_USER",
    label: "Onboard New User"
  },
  BULK_CHANGES: {
    value: "BULK_CHANGES",
    label: "Bulk Changes"
  }
};