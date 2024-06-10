import {
  Button, Grid
} from "@mui/material";
import ComponentControl from "../../../../core/SharedComponents/ComponentControl";
import React, {
  ChangeEvent, useContext, useEffect, useMemo, useState
} from "react";
import { ViewListIconToggleForm } from "../../common/Form/ViewList.IconToggle.Form";
import {
  HeadingStyled, ModalBodyStyled, ModalFooterStyled
} from "../../common/DynamicCallFlow.Styles";
import { CustomToast } from "components";
import {
  BrandName, readWriteAccess
} from "utils";
import {
  FormHandler, NOT_VALID
} from "../../common/Form/Abstract.Form.Handler";
import { FloatingHeader } from "@lmig/lmds-react-floating-header";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  FieldConfig, FieldConfigs
} from "../../common/Form/Form.Field.Config";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";

import {
  AlertBarProps, initialAlertBarProps
} from "../../common/AlertBar.Controller";
import {
  AlertBarControllerRef, ReactStateAction
} from "../../common/Container.Interfaces";
import { DynamicCallFlowPhoneNumberContext } from "../DynamicCallFlow.PhoneNumber.Container";
import { PhoneNumberModalTypeEnum } from "../DynamicCallFlow.PhoneNumber.Container.Modal.Controller";

export interface FormModalProps {
  isOpen: boolean;
  formHandler: FormHandler<PhoneNumberRecordType>;
  alertBarController: AlertBarControllerRef,
  selectedRow: PhoneNumberRecordType;
  fieldConfigsReactStateAction: ReactStateAction<FieldConfigs>;
  handleOnClone: () => void;
  postHandleOnSave: (record: PhoneNumberRecordType) => void;
  postHandleOnDelete: (record: PhoneNumberRecordType) => void;
}

export const PhoneNumberFormModal = ({
  isOpen, formHandler, alertBarController, selectedRow, fieldConfigsReactStateAction, handleOnClone, postHandleOnSave, postHandleOnDelete
}: FormModalProps): JSX.Element => {
  const {
    state: fieldConfigs
  } = fieldConfigsReactStateAction;
  const {
    accessToken,
    matchedGroups,
    currentOpenModal,
    modalController
  } = useContext(DynamicCallFlowPhoneNumberContext);

  const enableFlow = useMemo<boolean>(() => readWriteAccess(matchedGroups,"dynamic-call-flow"), []);
  const [formRecord, setFormRecord] = React.useState<PhoneNumberRecordType>({} as PhoneNumberRecordType);
  const [alertBarProps, setAlertBarProps] = useState<AlertBarProps>(initialAlertBarProps);

  useEffect(() => {
    setFormRecord({ ...selectedRow });
  }, [selectedRow]);

  const alertBarOnClose = () => {
    setAlertBarProps(prevState => ({
      ...prevState,
      open: false
    }));
  };

  const handleOnInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldConfigsReactStateAction: ReactStateAction<FieldConfigs>, key: string, value?: string): void => {
    setFormRecord(prevState => ({
      ...prevState,
      [key]: formHandler.getNewFieldValue(event, fieldConfigsReactStateAction, key, value)
    }));
  };

  const handleOnSave = async (): Promise<void> => {
    const formOnHandleResponse = await formHandler.handleOnSave(accessToken, formRecord, fieldConfigs);

    if (formOnHandleResponse.errorMessage) {
      alertBarController.current.error(formOnHandleResponse.errorMessage);
    } else {
      alertBarController.current.success(formOnHandleResponse.successMessage);
      modalController.current.closeModal();
      postHandleOnSave(formOnHandleResponse.record);
    }
  };

  const handleOnDelete = async (): Promise<void> => {
    const formOnHandleResponse = await formHandler.handleOnDelete(accessToken, formRecord);

    if (formOnHandleResponse.errorMessage) {
      alertBarController.current.error(formOnHandleResponse.errorMessage);
    } else {
      alertBarController.current.success(formOnHandleResponse.successMessage);
      modalController.current.closeModal();
      postHandleOnDelete(formOnHandleResponse.record);
    }
  };

  // When
  const canFieldEditBeDisabled = (): boolean => {
    return !(currentOpenModal === PhoneNumberModalTypeEnum.AddDynamicPhoneNumber || currentOpenModal === PhoneNumberModalTypeEnum.AddLegacyPhoneNumber);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        size="large"
        takeover={["base", "sm", "md", "lg"]}
        className="route-table-modal-wrapper"
        onClose={() => modalController.current.closeModal()}
      ><ModalHeader>
          {
            ["Liberty Mutual", "Safeco"].includes(formRecord?.brand)?
              (<FloatingHeader brand={BrandName[formRecord?.brand]} overlayIsOpen>
                <HeadingStyled type="h4-light">{`${formHandler?.modalLabel} ${PhoneNumberRecordUtil.getPhoneNumber(formRecord) || ""}`}</HeadingStyled>
              </FloatingHeader>):
              (
                <HeadingStyled type="h4-light">{`${formHandler?.modalLabel} ${PhoneNumberRecordUtil.getPhoneNumber(formRecord) || ""}`}
                </HeadingStyled>
              )
          }
        </ModalHeader>
        <ModalBodyStyled>
          <Grid container rowSpacing={3}>
            {Array.from<string>(Object.keys(fieldConfigs)).map((key: string) => {
              const {
                label, required, currentControl, isValid, options, disableEdit, fieldConditionCheck, isUserAbleToChangeControl, gridSize = 12
              }: FieldConfig = fieldConfigs[key];

              if (fieldConditionCheck && !fieldConditionCheck(formRecord)) {
                return;
              }

              return (
                <Grid container key={key} item xs={4}>
                  <Grid key={key} item xs={gridSize}>
                    <ComponentControl
                      control={currentControl}
                      name={key}
                      label={label}
                      type="text"
                      value={PhoneNumberRecordUtil.getPropertyValue(formRecord, key) || ""}
                      error={isValid === NOT_VALID}
                      dropDownOptions={options || []}
                      onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => handleOnInputChange(event, fieldConfigsReactStateAction, key, value)}
                      required={required}
                      disabled={canFieldEditBeDisabled() ? disableEdit : false}/>
                  </Grid>
                  {(isUserAbleToChangeControl) ? (<Grid item xs={1}>
                    <ViewListIconToggleForm field={key} fieldConfigsReactStateAction={fieldConfigsReactStateAction}></ViewListIconToggleForm>
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
            onClick={handleOnSave}
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
            onClick={handleOnClone}
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
            onClick={handleOnDelete}
          >
          Delete
          </Button>:null}
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
            aria-label="cancelEditFlowButton"
            onClick={() => modalController.current.closeModal()}
          >
          Cancel
          </Button>
        </ModalFooterStyled>
      </Modal>
      <CustomToast
        open={alertBarProps.open}
        onClose={ alertBarOnClose }
        msg={alertBarProps.msg}
        severityType={alertBarProps.severityType}
      />
    </div>
  );
};