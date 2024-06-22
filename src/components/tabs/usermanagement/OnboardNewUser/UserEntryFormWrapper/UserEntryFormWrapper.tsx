import { LoadingState } from "usermanagement/UserEntryFormWrapper.Interfaces";
import {
  DiscrepancyContainer,
  Header1,
  Header2,
  Header4,
  HeaderRow,
  ModalContainer,
  StyledDivider,
  Text
} from "usermanagement/UserEntryFormWrapper.Styles";
import { DeleteTritonUser } from "usermanagement/DeleteUserProfiles";
import { ModalOverlay } from "components/ModalOverlay";
import { BasicFormInfo } from "usermanagement/BasicFormInfo";
import { CallRecordingForm } from "usermanagement/CallRecordingForm";
import { UserFormButtons } from "usermanagement/UserFormButtons";
import { WfmForm } from "usermanagement/WfmForm";
import {
  useFormState,
  useAdminState,
  useSkillState,
  useFormDispatch
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import React from "react";
import { useNavigate } from "react-router-dom";
import { sortWorkersByFullName } from "utils/_sortUtils";
import { identifyUserProfiles } from "utils/usermanagementUtils";
import { logger } from "utils/logger";
import { formModes } from "globals";
import {
  UMUser,
  discrepancyType,
  ModalOverlayStatuses
} from "globals/interfaces";
import { Checkbox } from "@mui/material";

export const UserEntryForm = () => {

  const state = useAdminState();
  const form = useFormState();
  const setForm = useFormDispatch();
  const navigate = useNavigate();

  const workers = state.workerContext.workers.sort(sortWorkersByFullName);
  const tritonWorker = workers.find((w: any) => w?.attributes?.n_number === form.nNumber?.value);
  const managers = state.managerContext.managers;
  const profiles = state.profileContext.profiles;
  const offices = state.officeContext.offices;

  const [forwardToToggle, setForwardToToggle] = React.useState(false);
  const [missingFields, setMissingFields] = React.useState([]);
  const [loading, updateLoading] = React.useState<LoadingState>({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: null,
    saveUser: false
  });

  React.useEffect(() => {
    if (form.formMode === formModes.INSERT) {
      const workerFound = workers.find((w: UMUser) => w.attributes?.n_number?.toLowerCase() === form.nNumber.value?.toLowerCase());
      const duplicateTritonMessage = "This user already seems to have a Triton Record. Please cancel out of this form and edit their worker instead.";
      if (workerFound) {
        setForm({
          type: userFormActions.SET_DISCREPANCIES,
          payload: {
            type: discrepancyType.GENERAL,
            message: duplicateTritonMessage
          }
        });
      } else {
        const discrepancyListed = form.discrepancies.find((d: any) => d.message === duplicateTritonMessage);
        if (discrepancyListed) {
          setForm({
            type: userFormActions.CLEAR_DISCREPANCY,
            payload: duplicateTritonMessage
          });
        }
      }
    }
  }, [form.nNumber.nNumberFetchedUser]);

  React.useEffect(() => {
    if (form.formMode === formModes.INSERT) {
      setForm({
        type: userFormActions.UPDATE_USER_FOUND,
        payload: {
          system: "triton",
          isFound: true
        }
      });
      setForm({
        type: userFormActions.UPDATE_USER_FOUND,
        payload: {
          system: "calabrio_qm",
          isFound: true
        }
      });
    } else {
      identifyUserProfiles(form, setForm, state);
    }
    return () => {
      setForm({ type: userFormActions.RESET_FORM });
    };
  }, []);

  logger.log("FORM", form);

  const handleResetForm = () => {
    navigate(-1);
    setForm({ type: userFormActions.RESET_FORM });
  };

  const handleCheckbox = (checked: boolean, system: string) => {
    setForm({
      type: userFormActions.UPDATE_USER_FOUND,
      payload: {
        system,
        isFound: checked
      }
    });
  };

  return (
    <ModalContainer>
      {loading.saveUser ?
        <ModalOverlay
          status={loading.saveStatus}
          message={loading.overlayMessage}
          handleClose={() => {
            if (loading.saveStatus === ModalOverlayStatuses.PARTIAL_FAIL) {
              handleResetForm();
            } else {
              updateLoading({
                ...loading,
                saveUser: false
              });
            }

          }}
        /> : null}
      {form.formMode === formModes.INSERT && <Header1>Onboard New User</Header1>}
      {form.formMode === formModes.UPDATE && <Header1>Edit User</Header1>}
      {form.formMode === formModes.DELETE && <Header1>Deactivate User</Header1>}
      {form.formMode !== formModes.INSERT && tritonWorker && <Header2>{`${tritonWorker?.attributes.emp_first_name} ${tritonWorker?.attributes.emp_last_name}`}</Header2>}
      {form.formMode === formModes.DELETE &&
        <DeleteTritonUser
          handleClose={handleResetForm}
          loading={loading}
          updateLoading={updateLoading}
        />
      }
      {
        form.discrepancies.length > 0
          ? <DiscrepancyContainer>
            <Header4>Discrepencies have been found for this worker. They will be corrected when you hit `Save User` unless otherwise specified </Header4>
            {
              form.discrepancies.map((d: any, index: number) => {
                return (
                  <Text key={index}>{d.message}</Text>
                );
              })
            }
          </DiscrepancyContainer>
          : null
      }
      {form.formMode === formModes.UPDATE && !tritonWorker &&
        <>
          <StyledDivider />
          <h4>Edit WFM is not yet supported. To edit Triton or Calabrio QM profiles, please navigate to the worker through the Triton table. </h4>
        </>
      }
      <StyledDivider />
      <HeaderRow>
        <h2>Triton User Settings</h2>
        {form.formMode !== formModes.DELETE &&
          <Checkbox
            disabled={form.triton.userFound || (form.formMode === formModes.UPDATE && !tritonWorker)}
            checked={form.triton.userFound}
            onChange={(event: any) => handleCheckbox(event.target.checked, "triton")}
          />
        }
      </HeaderRow>
      {form.triton.userFound &&
        <BasicFormInfo
          worker={tritonWorker}
          profiles={profiles}
          managers={managers}
          forwardToToggle={forwardToToggle}
          setForwardToToggle={setForwardToToggle}
        />
      }
      <StyledDivider />
      <HeaderRow>
        <h2>Calabrio Quality Management User Settings</h2>
        {form.formMode !== formModes.DELETE &&
          <Checkbox
            disabled={form.calabrio_qm.userFound || (form.formMode === formModes.UPDATE && !tritonWorker)}
            checked={form.calabrio_qm.userFound}
            onChange={(event: any) => handleCheckbox(event.target.checked, "calabrio_qm")}
          />
        }
      </HeaderRow>
      {form.calabrio_qm.userFound && <CallRecordingForm
        twilioWorker={tritonWorker}
        missingFields={missingFields}
      />}
      <StyledDivider />
      <HeaderRow>
        <h2>Calabrio Work Force Management User Settings</h2>
        {form.formMode !== formModes.DELETE &&
          <Checkbox
            checked={form.calabrio_wfm.userFound}
            onChange={(event: any) => handleCheckbox(event.target.checked, "calabrio_wfm")}
          />
        }
      </HeaderRow>
      {form.calabrio_wfm.userFound &&
        <WfmForm
          missingFields={missingFields}
          setMissingFields={setMissingFields}
        />
      }
      {form.formMode === formModes.UPDATE && tritonWorker && missingFields.length > 0 && form.calabrio_wfm.userFound &&
        <>
          <StyledDivider />
          <h4>Edit WFM is not yet supported. If there are discrepencies in your WFM record, uncheck the wfm section to continue your edits. Your WFM record will remain unchanged </h4>
        </>
      }
      <StyledDivider />
      {form.formMode !== formModes.DELETE && <UserFormButtons
        setMissingFields={setMissingFields}
        forwardToToggle={forwardToToggle}
        handleClose={handleResetForm}
        loading={loading}
        offices={offices}
        profiles={profiles}
        updateLoading={updateLoading}
        worker={tritonWorker}
      />
      }
    </ModalContainer>
  );
};