export interface ManagerDropDownProps {
  filterBy: string,
  setFilter: (filter: string) => void
}

export interface DropdownOption {
  label: string,
  value: any
}