export interface OuFilterDropdownProps {
    filterBy: string,
    setFilter: (filter: string) => void
}

export interface DropdownOption {
    label: string,
    value: any
}