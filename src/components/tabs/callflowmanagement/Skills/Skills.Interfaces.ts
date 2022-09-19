export interface SkillsContainerProps {
  checked: any[],
  filteredState: any,
  selected: any,
  setChecked: (skills: any[]) => void
  setFilteredState: (filterState: any) => void
  setSelected: (selected: any[]) => void
}

export interface SkillsHeaderProps {
  filteredState: any,
  checked: any[],
  setFilteredState: (filterState: any) => void
}

export interface SkillsTableProps {
  checked: any[],
  filteredState: any,
  selected: any,
  setChecked: (skills: any[]) => void
  setFilteredState: (filterState: any) => void
  setSelected: (selected: any[]) => void
}