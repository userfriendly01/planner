import {
  ButtonWrapper,
  Button,
  ModalWrapper,
  CenteredDiv
} from "usermanagement/BulkChanges.Styles";
import {
  useAdminDispatch,
  useAdminState
} from "context/appContext";
import { Dropdown } from "components/Dropdown";
import { ModalFetchingRing } from "components/ModalFetchingRing";
import React from "react";
import { getCalabrioWfmOrg } from "utils/calabrioUtils";
import { ModalOverlayStatuses } from "globals/interfaces";
import { BusinessUnitModalProps } from "./BulkChanges.Interfaces";

export const BusinessUnitModal = (props: BusinessUnitModalProps) => {
  const {
    handleClose,
    handleConfirm
  } = props;

  const [ wfmBusinessUnit, setWfmBusinessUnit ] = React.useState(null);
  const [ status, setStatus ] = React.useState(null);

  const state = useAdminState();
  const dispatch = useAdminDispatch();

  const generateWFMBusinessUnitOptions = (): any[] => {
    const businessUnitOptions: any[] = [];
    state.calabrioContext.wfmOptions.forEach((bu: any) => {
      const option: any = {
        value: bu.Id,
        label: bu.Name
      };
      businessUnitOptions.push(option);
    });
    return businessUnitOptions;
  };

  const onConfirm = () => {
    handleConfirm(wfmBusinessUnit.value);
    handleClose();
  };

  return (
    <ModalWrapper>
      { state.calabrioContext.wfmOptions.length > 0 ?
        <>
          <Dropdown
            label="Select a WFM Business Unit"
            value={wfmBusinessUnit}
            options={generateWFMBusinessUnitOptions()}
            updateValue={async (event: any, businessUnit: any) => {
              try {
                setStatus(ModalOverlayStatuses.SAVING);
                setWfmBusinessUnit(businessUnit);
                await getCalabrioWfmOrg(businessUnit.value, state, dispatch);
                setStatus(ModalOverlayStatuses.SUCCESS);
              } catch(err) {
                setStatus(ModalOverlayStatuses.FAIL);
              }
            }}
            styles={{
              margin: "0 0 30 0",
              width: "500px"
            }}
          />
          { status === ModalOverlayStatuses.SAVING && <ModalFetchingRing/>}
          { status === ModalOverlayStatuses.SUCCESS &&
          <ButtonWrapper>
            <Button onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Confirm
            </Button>
          </ButtonWrapper>
          }
          { status === ModalOverlayStatuses.FAIL && <CenteredDiv>Business Unit Failed to Load, please try again.</CenteredDiv>}
        </>
        : <CenteredDiv>WFM Options failed to load, please refresh Triton Admin and try again</CenteredDiv>
      }
    </ModalWrapper>
  );
};