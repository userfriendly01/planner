export interface FilteredStateProps {
  searchBy: string,
  profiles: any[],
  closedFilter: boolean,
  flashFilter: boolean,
  filteredList: any[]
}

export enum Views {
  CLOSED_MESSAGE = "Closed Message Management",
  FLASH_MESSAGE = "Flash Message Management"
}