import {
  CustomTable,
  CustomTableData,
  CustomTableHeader,
  CustomTableRow,
  IconWrapper,
  NoListDiv,
  StyledPaper,
  TableText
} from "../PhoneNumber.Styles";
import {
  PhoneNumberTableProps
} from "../PhoneNumber.Interfaces";
import {
  Delete,
  Edit
} from "@mui/icons-material";
import { ModalOverlay } from "components/ModalOverlay";
import React from "react";
import { formatTenDigitNumber } from "utils/numberUtils";
import {
  DialListNumber, DirectoryNumber
} from "globals/interfaces";

export const PhoneNumberTable = (props: PhoneNumberTableProps) => {
  const {
    filteredList,
    editFunction,
    deleteFunction,
    type,
    saveState
  } = props;

  return(
    <div>
      {
        filteredList.length === 0 ? (
          <NoListDiv>
            <h1>{`No ${type} entries exist for this profile`}</h1>
          </NoListDiv>
        ) : (
          <StyledPaper elevation={3}>
            {saveState.status ?
              <ModalOverlay
                message={saveState.overlayMessage}
                status={saveState.status}
              /> : null}
            <CustomTable>
              <thead>
                <tr>
                  <CustomTableHeader>NAME</CustomTableHeader>
                  <CustomTableHeader>NUMBER</CustomTableHeader>
                </tr>
              </thead>
              <tbody>
                {type === "Directory" &&
                <div>
                  { filteredList.map((entry: DirectoryNumber) => ((
                    <CustomTableRow key={entry.id} data-testid="table-row">
                      <CustomTableData>
                        <TableText>{`${entry.last_name}, ${entry.first_name}`}</TableText>
                      </CustomTableData>
                      <CustomTableData>
                        <TableText>{formatTenDigitNumber(entry.directory_num)}</TableText>
                      </CustomTableData>
                      <CustomTableData>
                        <IconWrapper onClick={() => editFunction(entry)}>
                          <Edit fontSize={"inherit"} />
                        </IconWrapper>
                      </CustomTableData>
                      <CustomTableData>
                        <IconWrapper onClick={() => deleteFunction(entry)}>
                          <Delete fontSize={"inherit"} />
                        </IconWrapper>
                      </CustomTableData>
                    </CustomTableRow>
                  )))
                  }
                </div>}
                {type === "DialList" &&
                 <div>
                   { filteredList.map((entry: DialListNumber) => ((
                     <CustomTableRow key={entry.id} data-testid="table-row">
                       <CustomTableData>
                         <TableText>{`${entry.contact_name}`}</TableText>
                       </CustomTableData>
                       <CustomTableData>
                         <TableText>{formatTenDigitNumber(entry.contact_num)}</TableText>
                       </CustomTableData>
                       <CustomTableData>
                         <IconWrapper onClick={() => editFunction(entry)}>
                           <Edit fontSize={"inherit"} />
                         </IconWrapper>
                       </CustomTableData>
                       <CustomTableData>
                         <IconWrapper onClick={() => deleteFunction(entry)}>
                           <Delete fontSize={"inherit"} />
                         </IconWrapper>
                       </CustomTableData>
                     </CustomTableRow>
                   )))
                   }
                 </div>}
              </tbody>
            </CustomTable>
          </StyledPaper>
        )
      }
    </div>
  );
};