export interface SkillsContainerProps {
  checked: any[],
  tableState: any,
  setChecked: (skills: any[]) => void
  setTableState: (filterState: any) => void
}

export interface SkillsHeaderProps {
  tableState: any,
  checked: any[],
  setTableState: (filterState: any) => void
}

export interface SkillsTableProps {
  checked: any[],
  tableState: any,
  setChecked: (skills: any[]) => void
  setTableState: (filterState: any) => void
}