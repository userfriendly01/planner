import { MasterData } from "./DataGridState.Interfaces";

interface FilterModalProps<T> {
  isOpen: boolean;
  onClose: (flag: boolean) => boolean;
  handleChange: (event: any) => void;
  masterData: MasterData;
  selection: T;
  openModal: (flag: boolean, search: T) => void;
  applyFilter: () => void;
}