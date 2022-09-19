export interface TableStateProps {
  closedFilter: boolean,
  flashFilter: boolean,
  filteredList: any[],
  profiles: any[],
  searchBy: string,
  selected: any //replace with Skill type
}

export const views = [
  {
    value: "CLOSED_MESSAGE",
    label: "Closed Message Management"
  },
  {
    value: "FLASH_MESSAGE",
    label: "Flash Message Management"
  }
];