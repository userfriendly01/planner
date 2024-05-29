import {
  Button, Grid
} from "@mui/material";
import ComponentControl from "../../../../core/SharedComponents/ComponentControl";
import React, { useMemo } from "react";
import { ViewListIconToggle } from "../../common/Form/ViewListIconToggle";
import {
  HeadingStyled, ModalBodyStyled, ModalFooterStyled
} from "../DynamicCallFlowPhoneNumber.Styles";
import { CustomToast } from "components";
import {
  BrandName, readWriteAccess
} from "utils";
import { AzureSPA } from "../../../../../globals";
import { NOT_VALID } from "../../common/Form/AbstractForm.Handler";
import { FloatingHeader } from "@lmig/lmds-react-floating-header";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import { BRAND } from "./DynamicPhoneNumberForm.Fields";
import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { FormFieldUtil } from "../../common/Form/FormField.Util";
import { FormFieldConfig } from "../../common/Form/FormFieldConfig.State";
import { PhoneNumberFormHandler } from "./AbstractPhoneNumberForm.Handler";
import { PhoneNumberFormManager } from "./PhoneNumberForm.Manager";

export enum PhoneNumberFormType {
  Dynamic = "dynamic",
  Legacy = "legacy"
}

export interface ModalFormProps {
  formHandler: PhoneNumberFormHandler;
  formManager: PhoneNumberFormManager;
}

export const PhoneNumberFormModal = ({
  matchedGroups, formHandler, formManager
}: AzureSPA & ModalFormProps): JSX.Element => {
  const enableFlow = useMemo<boolean>(() => readWriteAccess(matchedGroups,"dynamic-call-flow"), []);

  const alertBarOnClose = (isOpen: boolean) => {
    formHandler.dataGridManager.alertBar.open = isOpen;
  };

  return (
    <div>
      <Modal
        isOpen={formHandler.isModalOpen}
        size="large"
        takeover={["base", "sm", "md", "lg"]}
        className="route-table-modal-wrapper"
        onClose={formHandler.handleOnClose}
      ><ModalHeader>
          {
            ["Liberty Mutual", "Safeco"].includes(formHandler.record[BRAND])?
              (<FloatingHeader brand={BrandName[formHandler.record[BRAND]]} overlayIsOpen>
                <HeadingStyled type="h4-light">{formHandler.modalLabel}</HeadingStyled>
              </FloatingHeader>):
              (
                <HeadingStyled type="h4-light">{formHandler.modalLabel}
                </HeadingStyled>
              )
          }
        </ModalHeader>
        <ModalBodyStyled>
          <Grid container rowSpacing={3}>
            {Array.from<string>(Object.keys(formManager.fieldConfigs.state)).map((key: string) => {
              const {
                label, required, disableEdit, fieldConditionCheck, isUserAbleToChangeControl, gridSize = 12
              }: FormFieldConfig = formManager.fieldConfigs.state[key];

              if (fieldConditionCheck && !fieldConditionCheck(formManager.fieldConfigs.state)) {
                return;
              }

              return (
                <Grid container key={key} item xs={4}>
                  <Grid key={key} item xs={gridSize}>
                    <ComponentControl
                      control={formManager.fieldControl.current(key)}
                      name={key}
                      label={label}
                      type="text"
                      value={FormFieldUtil.getValue<PhoneNumberRecordType>(formHandler.record, key)}
                      error={formManager.fieldConfigs.state[key].isValid === NOT_VALID}
                      dropDownOptions={formManager.fieldOptions.get(key)}
                      onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => formHandler.handleInputChange(event, key, value)}
                      required={required}
                      disabled={disableEdit}/>
                  </Grid>
                  {(isUserAbleToChangeControl) ? (<Grid item xs={1}>
                    <ViewListIconToggle field={key} fieldControl={formManager.fieldControl}></ViewListIconToggle>
                  </Grid>) : (<div></div>)}
                </Grid>
              );
            })}
          </Grid>
        </ModalBodyStyled>
        <ModalFooterStyled>
          <Button
            variant="contained"
            value="Save"
            color="primary"
            disabled={enableFlow || undefined}
            sx={{ marginRight: 2 }}
            aria-label="saveFlowRuleButton"
            onClick={() => formHandler.handleOnSave()}
          >
          Save
          </Button>
          {formHandler.displayCloneButton?<Button
            variant="contained"
            value="Clone"
            color="primary"
            disabled={enableFlow || undefined}
            sx={{ marginRight: 2 }}
            aria-label="cloneFlowRuleButton"
            onClick={() => formHandler.handleOnClone()}
          >
          Clone
          </Button>:null}
          {formHandler.displayDeleteButton?<Button
            variant="contained"
            color="error"
            value="Delete"
            disabled={enableFlow || undefined}
            sx={{ marginRight: 2 }}
            aria-label="deleteFlowRuleButton"
            onClick={() => formHandler.handleOnDelete()}
          >
          Delete
          </Button>:null}
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
            aria-label="cancelEditFlowButton"
            onClick={() => formHandler.handleOnCancel()}
          >
          Cancel
          </Button>
        </ModalFooterStyled>
      </Modal>
      <CustomToast
        open={formHandler.dataGridManager.alertBar.open}
        onClose={ alertBarOnClose }
        msg={formHandler.dataGridManager.alertBar.msg}
        severityType={formHandler.dataGridManager.alertBar.severityType}
      />
    </div>
  );
};