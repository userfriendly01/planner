import {
  Button, Grid
} from "@mui/material";
import React, {
  ChangeEvent, useContext, useEffect, useMemo, useState
} from "react";
import { ViewListIconToggleForm } from "components/tabs/dynamicCallFlow/common/Form/ViewList.IconToggle.Form";
import {
  HeadingStyled, ModalBodyStyled, ModalFooterStyled
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Styles";
import {
  FormHandler, FormOnHandleResponse, NOT_VALID
} from "components/tabs/dynamicCallFlow/common/Form/Abstract.Form.Handler";
import { FloatingHeader } from "@lmig/lmds-react-floating-header";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  BrandName, PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  FieldConfig, FieldConfigs
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  AlertBarProps, initialAlertBarProps
} from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";
import {
  AlertBarControllerRef, ReactStateAction
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { DynamicCallFlowPhoneNumberContext } from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Container";
import { ComponentControl } from "components/ComponentControl";
import { CustomToast } from "components/CustomToast";
import { PhoneNumberModalTypeEnum } from "components/tabs/dynamicCallFlow/phoneNumber/DynamicCallFlow.PhoneNumber.Interfaces";
import {
  DYNAMIC_CALL_FLOW_ROLE,
  userDoesNotHaveReadWriteAccess
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Authentication";

export interface FormModalProps {
  isOpen: boolean;
  formHandler: FormHandler<PhoneNumberRecordType>;
  alertBarController: AlertBarControllerRef,
  selectedRow: PhoneNumberRecordType;
  fieldConfigsReactStateAction: ReactStateAction<FieldConfigs>;
  handleOnClone: () => void;
  postFormHandler: () => void;
}

export const PhoneNumberFormModal = ({
  isOpen, formHandler, alertBarController, selectedRow, fieldConfigsReactStateAction, handleOnClone, postFormHandler
}: FormModalProps): JSX.Element => {
  const {
    state: fieldConfigs
  } = fieldConfigsReactStateAction;
  const {
    accessTokenGraph,
    permissions,
    currentOpenModal,
    modalController
  } = useContext(DynamicCallFlowPhoneNumberContext);

  const userDoesNotHavePermission = useMemo<boolean>(() => userDoesNotHaveReadWriteAccess(permissions, DYNAMIC_CALL_FLOW_ROLE), []);
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
    PhoneNumberRecordUtil.setPropertyValue(formRecord, key, formHandler.getHtmlInputElementValue(event, fieldConfigsReactStateAction, key, value));
    setFormRecord({ ...formRecord });
  };

  const handleOnSave = async (): Promise<void> => {
    const formOnHandleResponse = await formHandler.handleOnSave(accessTokenGraph, formRecord, fieldConfigs);

    postHandleAction(formOnHandleResponse);
  };

  const handleOnDelete = async (): Promise<void> => {
    const formOnHandleResponse = await formHandler.handleOnDelete(accessTokenGraph, formRecord);

    postHandleAction(formOnHandleResponse);
  };

  const postHandleAction = (formOnHandleResponse: FormOnHandleResponse<PhoneNumberRecordType>): void => {
    if (formOnHandleResponse.errorMessage) {
      alertBarController.current.error(formOnHandleResponse.errorMessage);
    } else {
      alertBarController.current.success(formOnHandleResponse.successMessage);
      postFormHandler();
    }
  };

  // When
  const canFieldEditBeDisabled = (): boolean => {
    return !(currentOpenModal === PhoneNumberModalTypeEnum.AddDynamicPhoneNumber || currentOpenModal === PhoneNumberModalTypeEnum.AddLegacyPhoneNumber);
  };

  const handleOnClose = (): void => {
    modalController.current.closeModal();
    setFormRecord({} as PhoneNumberRecordType);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        size="large"
        takeover={["base", "sm", "md", "lg"]}
        className="route-table-modal-wrapper"
        onClose={handleOnClose}
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
            disabled={userDoesNotHavePermission}
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
            disabled={userDoesNotHavePermission}
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
            disabled={userDoesNotHavePermission}
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