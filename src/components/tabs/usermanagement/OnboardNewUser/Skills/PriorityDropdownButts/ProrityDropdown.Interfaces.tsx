export interface PriorityDropdownProps {
  availablePriorities: number[],
  priorityValue: number,
  updatePriority: (level: string) => void
}