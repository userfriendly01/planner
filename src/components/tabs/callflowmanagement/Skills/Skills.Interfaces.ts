export interface SkillsContainerProps {
  filteredState: any,
  checked: any[],
  setChecked: (skills: any[]) => void
  setFilteredState: (filterState: any) => void
}

export interface SkillsHeaderProps {
  filteredState: any,
  checked: any[],
  setFilteredState: (filterState: any) => void
}

export interface SkillsTableProps {
  filteredState: any,
  checked: any[],
  setChecked: (skills: any[]) => void
  setFilteredState: (filterState: any) => void
}