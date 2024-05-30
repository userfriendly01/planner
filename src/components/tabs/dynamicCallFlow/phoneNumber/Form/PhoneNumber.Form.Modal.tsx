import {
  Button, Grid
} from "@mui/material";
import ComponentControl from "../../../../core/SharedComponents/ComponentControl";
import React, { useMemo } from "react";
import { ViewListIconToggleForm } from "../../common/Form/ViewList.IconToggle.Form";
import {
  HeadingStyled, ModalBodyStyled, ModalFooterStyled
} from "../DynamicCallFlowPhoneNumber.Styles";
import { CustomToast } from "components";
import {
  BrandName, readWriteAccess
} from "utils";
import { AzureSPA } from "../../../../../globals";
import { NOT_VALID } from "../../common/Form/Abstract.Form.Handler";
import { FloatingHeader } from "@lmig/lmds-react-floating-header";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import { BRAND } from "./Dynamic.PhoneNumber.Form.Fields";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { FieldFormUtil } from "../../common/Form/Field.Form.Util";
import { FieldConfig } from "../../common/Form/Form.FieldConfig.State";
import { PhoneNumberFormManager } from "./PhoneNumber.Form.Manager";
import {AlertBarState} from "../../common/StateManager/AlertBar.State";

export enum PhoneNumberFormType {
  Dynamic = "dynamic",
  Legacy = "legacy"
}

export interface ModalFormProps {
  formManager: PhoneNumberFormManager;
  alertBar: AlertBarState
}

export const PhoneNumberFormModal = ({
  matchedGroups, formManager, alertBar
}: AzureSPA & ModalFormProps): JSX.Element => {
  const enableFlow = useMemo<boolean>(() => readWriteAccess(matchedGroups,"dynamic-call-flow"), []);

  const alertBarOnClose = (isOpen: boolean) => {
    alertBar.open = isOpen;
  };

  return (
    <div>
      <Modal
        isOpen={formManager.isFormModalOpen}
        size="large"
        takeover={["base", "sm", "md", "lg"]}
        className="route-table-modal-wrapper"
        onClose={formManager.formHandler.handleOnClose}
      ><ModalHeader>
          {
            ["Liberty Mutual", "Safeco"].includes(formManager.record[BRAND])?
              (<FloatingHeader brand={BrandName[formManager.record[BRAND]]} overlayIsOpen>
                <HeadingStyled type="h4-light">{formManager.formHandler.modalLabel}</HeadingStyled>
              </FloatingHeader>):
              (
                <HeadingStyled type="h4-light">{formManager.formHandler.modalLabel}
                </HeadingStyled>
              )
          }
        </ModalHeader>
        <ModalBodyStyled>
          <Grid container rowSpacing={3}>
            {Array.from<string>(Object.keys(formManager.state.fieldConfigs)).map((key: string) => {
              const {
                label, required, disableEdit, fieldConditionCheck, isUserAbleToChangeControl, gridSize = 12
              }: FieldConfig = formManager.state.fieldConfigs[key];

              if (fieldConditionCheck && !fieldConditionCheck(formManager.record)) {
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
                      value={FieldFormUtil.getValue<PhoneNumberRecordType>(formManager.record, key)}
                      error={formManager.state.fieldConfigs[key].isValid === NOT_VALID}
                      dropDownOptions={formManager.state.fieldConfigs[key].options}
                      onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => formManager.handleInputChange(event, key, value)}
                      required={required}
                      disabled={disableEdit}/>
                  </Grid>
                  {(isUserAbleToChangeControl) ? (<Grid item xs={1}>
                    <ViewListIconToggleForm field={key} formFieldControl={formManager.fieldControl}></ViewListIconToggleForm>
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
            onClick={() => formManager.formHandler.handleOnSave()}
          >
          Save
          </Button>
          {formManager.formHandler.displayCloneButton?<Button
            variant="contained"
            value="Clone"
            color="primary"
            disabled={enableFlow || undefined}
            sx={{ marginRight: 2 }}
            aria-label="cloneFlowRuleButton"
            onClick={() => formManager.formHandler.handleOnClone()}
          >
          Clone
          </Button>:null}
          {formManager.formHandler.displayDeleteButton?<Button
            variant="contained"
            color="error"
            value="Delete"
            disabled={enableFlow || undefined}
            sx={{ marginRight: 2 }}
            aria-label="deleteFlowRuleButton"
            onClick={() => formManager.formHandler.handleOnDelete()}
          >
          Delete
          </Button>:null}
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
            aria-label="cancelEditFlowButton"
            onClick={() => formManager.formHandler.handleOnCancel()}
          >
          Cancel
          </Button>
        </ModalFooterStyled>
      </Modal>
      <CustomToast
        open={alertBar.open}
        onClose={ alertBarOnClose }
        msg={alertBar.msg}
        severityType={alertBar.severityType}
      />
    </div>
  );
};