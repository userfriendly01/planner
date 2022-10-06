export const enum TabNames {
  USER_MANAGEMENT = "User Management",
  PROFILE_SETTINGS = "Profile Settings",
  CALL_FLOW_MANAGEMENT = "Call Flow Management"
}

export interface TabPanelProps {
  children?: any,
  index: any,
  tabName: TabNames,
  value: any
}