import { Office } from "globals";
import { DbOffice } from "services";

export const formatOfficesResponse = (response: DbOffice[]): Map<string, Office> => {
  if (response) {
    return new Map(response.map(office => {
      return [
        office.office_num,
        {
          office_nme: office.office_nme,
          office_num: office.office_num
        }
      ];
    }));
  } else {
    return new Map();
  }
};