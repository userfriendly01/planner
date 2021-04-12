import { useState } from "react";
import {
  formatE164PhoneNumber,
  getValidSkillsObject
} from "utils";
import {
  FetchUserResponse
} from "services";
import {
  formModes
} from "globals";
import {
  Manager,
  TwilioWorker,
  TwilioWorkerSkills
} from "context";

interface FieldState {
  value: string,
  blurred?: boolean,
  e164?: string,
  updated: boolean,
  valid?: boolean
}

interface UserEntryForm_FormState {
  [index: string]: any;
  defaultSkills: TwilioWorkerSkills,
  defaultSkillsUpdated: boolean,
  didUser: boolean,
  extension: FieldState,
  inactiveForwardTo: FieldState,
  manager: FieldState,
  nNumber: FieldState,
  nNumberFetchedUser: FetchUserResponse,
  outgoing: FieldState,
  profileId: FieldState,
  alternateDid: FieldState,
  directDialNum: FieldState,
  zeroOutEnabled: boolean,
  editDisabled: boolean
}

interface LoadingState {
  lookupUser: boolean;
  overlayMessage: string;
  saveStatus: string;
  saveUser: boolean;
}

interface useFormResponse {
  form: UserEntryForm_FormState,
  handleOnBlur: (field: string) => void,
  handleNumberUpdate: (
    maskedValue: string, isValid: boolean, e164Number: string, field: string
  ) => void
  initialDefaultSkills: TwilioWorkerSkills,
  loading: LoadingState,
  updateLoading: React.Dispatch<React.SetStateAction<LoadingState>>,
  setForm: React.Dispatch<React.SetStateAction<UserEntryForm_FormState>>
}

const useUserEntryForm = (
  formMode: string, worker: TwilioWorker, managers: Manager[]
): useFormResponse => {

  const initialDefaultSkills = getValidSkillsObject();
  const getInitialFormState = (): UserEntryForm_FormState => {
    const initialForm: UserEntryForm_FormState = {
      defaultSkills: initialDefaultSkills,
      defaultSkillsUpdated: false,
      didUser: false,
      extension: {
        value: "",
        blurred: false,
        updated: false,
        valid: false
      },
      inactiveForwardTo: {
        value: null,
        updated: false
      },
      manager: {
        value: "",
        blurred: false,
        updated: false
      },
      nNumber: {
        value: "n",
        blurred: false,
        updated: false
      },
      nNumberFetchedUser: null,
      outgoing: {
        value: "",
        blurred: false,
        e164: undefined,
        updated: false,
        valid: false
      },
      profileId: {
        value: "",
        blurred: false,
        updated: false
      },
      alternateDid: {
        value: "",
        blurred: false,
        e164: undefined,
        updated: false,
        valid: false
      },
      directDialNum: {
        value: "",
        blurred: false,
        e164: undefined,
        updated: false,
        valid: false
      },
      zeroOutEnabled: false,
      editDisabled: false
    };
    if (formMode === formModes.UPDATE) {
      initialForm.defaultSkills = getValidSkillsObject(worker.attributes.default_skills);
      initialForm.extension.value = worker.attributes.extension || "";
      initialForm.extension.valid = true;
      initialForm.manager.value = JSON.stringify(managers.find(m => m.manager_n_number === worker.attributes.manager_n_number));
      initialForm.nNumber.value = worker.attributes.n_number || "n";
      initialForm.outgoing.value = worker.attributes.did ? formatE164PhoneNumber(worker.attributes.did) : "";
      initialForm.outgoing.valid = worker.attributes.did ? true : false;
      initialForm.profileId.value = `${worker.attributes.profile_id}`;
      initialForm.alternateDid.value = worker.alternateDid ? formatE164PhoneNumber(worker.alternateDid) : "";
      initialForm.alternateDid.valid = worker.alternateDid ? true : false;
      initialForm.directDialNum.value = worker.directDialNum ? formatE164PhoneNumber(worker.directDialNum) : "";
      initialForm.directDialNum.valid = worker.directDialNum ? true : false;
      initialForm.didUser = worker.directDialNum ? true : false;
      initialForm.zeroOutEnabled = worker.zeroOutEnabled || false;
      initialForm.editDisabled = worker.directDialNum ? true : false;
    }
    return initialForm;
  };

  const [form, setForm] = useState<UserEntryForm_FormState>(getInitialFormState());
  const [loading, updateLoading] = useState<LoadingState>({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: null,
    saveUser: false
  });

  const handleNumberUpdate = (
    maskedValue: string, isValid: boolean, e164Number: string, field: string
  ): void => {
    setForm({
      ...form,
      [field]: {
        ...form[field],
        value: maskedValue,
        e164: e164Number,
        updated: true,
        valid: isValid && (e164Number ? true : false)
      }
    });
  };

  const handleOnBlur = (field: string): void => {
    setForm({
      ...form,
      [field]: {
        ...form[field],
        blurred: true
      }
    });
  };

  return {
    form,
    handleOnBlur,
    handleNumberUpdate,
    initialDefaultSkills,
    loading,
    updateLoading,
    setForm
  };
};

export default useUserEntryForm;
