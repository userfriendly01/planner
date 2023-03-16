import {
  ButtonWrapper,
  Button,
  ModalWrapper,
  TextWrapper
} from "./BulkChanges.Styles";
import {
  useAdminState
} from "context";
import { Dropdown } from "components/core";
import React from "react";
import { BusinessUnitModalProps } from "./BulkChanges.Interfaces";


const BusinessUnitModal = (props: BusinessUnitModalProps) => {
  const {
    setShowBusinessUnitModal,
    wfmBusinessUnit,
    setWfmBusinessUnit,
    handleExport
  } = props;

  const state = useAdminState();

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

  const handleConfirm = () => {
    if (wfmBusinessUnit) {
      handleExport();
      setShowBusinessUnitModal(false);
    }
  };

  return (
    <ModalWrapper>
            Select a WFM Business unit to generate the template options.
      <Dropdown
        label="Select a WFM Business Unit"
        value={wfmBusinessUnit}
        options={generateWFMBusinessUnitOptions()}
        updateValue={(event: any, businessUnit: any) => {
          setWfmBusinessUnit(businessUnit);
        }}
        styles={{
          margin: "40 0 30 0",
          width: "500px"
        }}
      />
      <ButtonWrapper>
        <Button onClick={() => setShowBusinessUnitModal(false)}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>
          Confirm
        </Button>
      </ButtonWrapper>
    </ModalWrapper>
  );
};

export default BusinessUnitModal;