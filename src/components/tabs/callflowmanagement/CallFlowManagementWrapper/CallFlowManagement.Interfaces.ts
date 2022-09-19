export interface FilteredStateProps {
  searchBy: string,
  profiles: any[],
  closedFilter: boolean,
  flashFilter: boolean,
  filteredList: any[]
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