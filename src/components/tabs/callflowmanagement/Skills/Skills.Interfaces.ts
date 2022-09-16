export interface SkillsContainerProps {
  filteredState: any,
  selected: any[],
  setSelected: (skills: any[]) => void
  setFilteredState: (filterState: any) => void
}

export interface SkillsHeaderProps {
  filteredState: any,
  selected: any[],
  setFilteredState: (filterState: any) => void
}

export interface SkillsTableProps {
  filteredState: any,
  selected: any[],
  setSelected: (skills: any[]) => void
  setFilteredState: (filterState: any) => void
}