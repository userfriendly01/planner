import {
  getE164Number
} from "@lmig/phone-number-utils";
import {
  OutlinedSelect,
  ModalNNumber,
  ModalExtension,
  ModalOverlay,
  ModalPhoneNumber,
  PaperContainer,
  StyledButton,
  UserEntryFormState
} from "components";
import {
  Manager,
  useAdminDispatch,
  useAdminState
} from "context";
import {
  apiPaths,
  extensionMatcher,
  modalOverlayStatuses,
  modalOverlayTimeout
} from "globals";
import React, {
  useState
} from "react";
import styled from "styled-components";
import {
  mapWorkerFromTwilioWorker,
  myAxios,
  sortManagersByName
} from "utils";

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const Header = styled.h1`
  align-self: center;
`;

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const defaultNNumber = "n";

interface UserEntryFormProps {
  userEntryFormState: UserEntryFormState,
  handleClose: VoidFunction,
}

interface FormState {
  extension: string,
  extensionValid: boolean,
  lookupInfo: {
    departmentName?: string,
    departmentNumber?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    officeName?: string,
    officeNumber?: string
  },
  lookupError: any,
  manager: string,
  managerUpdated: boolean,
  nNumber: string,
  nNumberUpdated: boolean,
  outgoing: string,
  outgoingValid: boolean,
  outgoingUpdated: boolean,
  team: string,
  teamUpdated: boolean
}

const UserEntryForm = (props: UserEntryFormProps) => {

  const {
    handleClose,
    userEntryFormState
  } = props;

  const dispatch = useAdminDispatch();
  const {
    profileContext: {
      profiles
    },
    managerContext: {
      managers
    }
  } = useAdminState();

  const [form, setForm] = useState<FormState>({
    extension: "",
    extensionValid: false,
    lookupInfo: {},
    lookupError: null,
    manager: "",
    managerUpdated: false,
    nNumber: defaultNNumber,
    nNumberUpdated: false,
    outgoing: "",
    outgoingValid: false,
    outgoingUpdated: false,
    team: "",
    teamUpdated: false
  });
  const [loading, updateLoading] = useState({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: null,
    saveUser: false
  });

  const updateUser = () => {
    // COPIED FROM EDIT USER MODAL


    // setSaveUser(loadingStates.saving);
    // const attributes = {};
    // if (form.defaultSkillsUpdated) {
    //   attributes.default_skills = form.defaultSkills;
    // }
    // if (form.managerUpdated) {
    //   const parsedManager = JSON.parse(form.manager);
    //   attributes.manager_first_name = parsedManager.manager_first_name;
    //   attributes.manager_last_name = parsedManager.manager_last_name;
    //   attributes.manager_n_number = parsedManager.manager_n_number;
    // }
    // if (form.extensionUpdated) {
    //   attributes.extension = extension;
    // }
    // myAxios
    //   .post(apiPaths.UPDATE_WORKER_ATTRIBUTES, {
    //     workerSid: worker.sid,
    //     attributes
    //   })
    //   .then(res => {
    //     const updatedWorker = res.data;
    //     dispatch(({
    //       type: "updateWorker",
    //       payload: mapWorkerFromTwilioWorker(updatedWorker)
    //     }));
    //     setSaveUser(loadingStates.success);
    //     setTimeout(() => handleClose(), 2000);
    //   })
    //   .catch(err => {
    //     setSaveUser(loadingStates.fail);
    //     setTimeout(() => setSaveUser(null), 2000);
    //     console.error("EditUserModal - Failed to update twilio worker", err);
    //   });
  };

  const addUser = () => {
    updateLoading({
      ...loading,
      overlayMessage: "Adding new user...",
      saveStatus: modalOverlayStatuses.SAVING,
      saveUser: true
    });
    const parsedManager = JSON.parse(form.manager);
    let outgoingE164;
    try {
      outgoingE164 = getE164Number(form.outgoing);
    } catch (err) {
      console.error("AddUserModal - Failed to convert outgoing number to E164", {
        err,
        outgoingNumber: form.outgoing
      });
      updateLoading({
        ...loading,
        overlayMessage: "Failed to add new user. Could not convert outgoing number to E164 format.",
        saveStatus: modalOverlayStatuses.FAIL,
        saveUser: true
      });
      setTimeout(() => {
        updateLoading({
          ...loading,
          saveUser: false
        });
      }, modalOverlayTimeout);
      return;
    }

    // see this wiki page for attributes that will be automatically updated through SSO
    // https://forge.lmig.com/wiki/display/CICCT/Twilio+Flex+SSO+Saml2+Integration
    const attributes = {
      did: outgoingE164,
      email: form.lookupInfo.email,
      email_address: form.lookupInfo.email,
      emp_first_name: form.lookupInfo.firstName,
      emp_last_name: form.lookupInfo.lastName,
      extension: form.extension,
      full_name: `${form.lookupInfo.firstName} ${form.lookupInfo.lastName}`,
      manager_first_name: parsedManager.manager_first_name,
      manager_last_name: parsedManager.manager_last_name,
      manager_n_number: parsedManager.manager_n_number,
      n_number: form.nNumber.toLowerCase(),
      office_location_name: form.lookupInfo.officeName,
      office_location_number: form.lookupInfo.officeNumber,
      primary_dept_name: form.lookupInfo.departmentName,
      primary_dept_number: form.lookupInfo.departmentNumber,
      profile_id: form.team
    };
    myAxios.post(apiPaths.CREATE_WORKER, { attributes })
      .then(res => {
        const twilioWorker = res.data;
        setForm({
          ...form,
          extension: "", // clear out extension values
          extensionValid: false,
          lookupError: null, // clear out user lookup values
          lookupInfo: {},
          nNumber: defaultNNumber
        });
        dispatch({
          type: "addWorkers",
          payload: [mapWorkerFromTwilioWorker(twilioWorker)]
        });
        updateLoading({
          ...loading,
          overlayMessage: "Successfully added new user",
          saveStatus: modalOverlayStatuses.SUCCESS,
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, modalOverlayTimeout);
      })
      .catch(err => {
        updateLoading({
          ...loading,
          overlayMessage: "Failed to add new user",
          saveStatus: modalOverlayStatuses.FAIL,
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, modalOverlayTimeout);
        console.error("AddUserModal - Failed to create worker in twilio workspace", err);
      });
  };

  const nNumberInputValid = JSON.stringify(form.lookupInfo) !== JSON.stringify({});
  const extensionInputValid = (form.extensionValid || form.extension === "");
  const managerValid = form.manager !== "";
  const teamValid = form.team !== "";
  const formReady = nNumberInputValid && teamValid && managerValid && form.outgoingValid && extensionInputValid;

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ?
          <ModalOverlay
            status={loading.saveStatus}
            message={loading.overlayMessage}
          /> : null}
        <Header>Add a User</Header>
        <OutlinedSelect
          error={form.managerUpdated && !managerValid}
          helperText={managerValid ? null : "Please select a manager"}
          label={"Manager"}
          labelWidth={67}
          onBlur={() => setForm({
            ...form,
            managerUpdated: true
          })}
          optionsList={managers.sort(sortManagersByName)}
          optionsDisplayFunc={option => {
            return {
              display: `${option.manager_first_name} ${option.manager_last_name}`,
              key: option.manager_n_number,
              value: JSON.stringify(option)
            };
          }}
          updateValue={newValue => setForm({
            ...form,
            manager: newValue
          })}
          value={form.manager}
        />
        <OutlinedSelect
          error={form.teamUpdated && !teamValid}
          helperText={teamValid ? null : "Please select a team"}
          label={"Team"}
          labelWidth={44}
          onBlur={() => setForm({
            ...form,
            teamUpdated: true
          })}
          optionsList={profiles}
          optionsDisplayFunc={option => {
            return {
              display: option.profile_nme,
              key: option.profile_id,
              value: option.profile_id
            };
          }}
          updateValue={newValue => setForm({
            ...form,
            team: newValue
          })}
          value={form.team}
        />
        <ModalPhoneNumber
          allowSevenDigitVdn={false}
          id="outgoing-number"
          number={form.outgoing}
          onBlur={() => setForm({
            ...form,
            outgoingUpdated: true
          })}
          label="Outgoing Number"
          showError={form.outgoingUpdated}
          updateValue={(maskedValue, unmaskedValue, isValid) => {
            setForm({
              ...form,
              outgoing: maskedValue,
              outgoingValid: isValid
            });
          }}
        />
        <ModalNNumber
          clearUser={() => {
            setForm({
              ...form,
              lookupError: null,
              lookupInfo: {},
              nNumber: defaultNNumber
            });
          }}
          disabled={JSON.stringify(form.lookupInfo) !== "{}"}
          error={form.nNumberUpdated && !nNumberInputValid}
          form={form}
          nNumber={form.nNumber}
          onBlur={() => setForm({
            ...form,
            nNumberUpdated: true
          })}
          setForm={setForm}
          updateValue={newValue => setForm({
            ...form,
            nNumber: newValue
          })}
        />
        <ModalExtension
          clearExtension={() => {
            setForm({
              ...form,
              extension: "",
              extensionValid: false
            });
          }}
          disabled={form.extensionValid && extensionMatcher.test(form.extension)}
          error={!extensionInputValid}
          extension={form.extension}
          updateValue={newValue => setForm({
            ...form,
            extension: newValue
          })}
          form={form}
          setForm={setForm}
        />
        <ButtonWrapper>
          <StyledButton disabled={!formReady} onClick={addUser}>{} User</StyledButton>
          <StyledButton onClick={handleClose}>Close</StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default UserEntryForm;