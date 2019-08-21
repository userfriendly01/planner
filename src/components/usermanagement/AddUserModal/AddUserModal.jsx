import {
  Paper
} from "@material-ui/core";
import {
  CustomButton,
  CustomSelect,
  ModalHeader,
  ModalHelperText,
  ModalNNumber,
  ModalOverlay,
  ModalPhoneNumber
} from "components";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import { myAxios } from "utils";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const PaperContainer = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
`;

const AddUserModal = props => {

  const nNumMatcher = /[n,N]\d{7}/g;
  const {
    handleClose,
    managerList
  } = props;
  const {
    profileContext: {
      profiles
    }
  } = useAdminState();
  const [disableNNumber, setDisableNNumber] = useState(false);
  const [form, setForm] = useState({
    lookupInfo: {},
    nNumber: "N",
    manager: "",
    outgoing: "",
    team: ""
  });
  const [formReady, setFormReady] = useState(false);
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveStatus: "saving",
    saveUser: false
  });

  useEffect(() => {
    if (form.nNumber.match(nNumMatcher)) {
      updateLoading({
        ...loading,
        lookupUser: true
      });
      myAxios
        .get(apiPaths.EMPLOYEE_LOOKUP(form.nNumber.substring(1)))
        .then(res => {
          if (res.data.length !== 0) {
            setForm({
              ...form,
              lookupError: null,
              lookupInfo: {
                email: res.data[0].person.data.Email,
                firstName: res.data[0].person.data.FirstName,
                lastName: res.data[0].person.data.LastName,
                officeName: res.data[0].person.data.OfficeName,
                officeNumber: res.data[0].person.data.OfficeNumber,
                departmentName: res.data[0].person.data.DepartmentName,
                departmentNumber: res.data[0].person.data.DepartmentNumber
              }
            });
            setDisableNNumber(true);
          } else {
            setForm({
              ...form,
              lookupInfo: {},
              lookupError: "User Not Found"
            });
          }
        })
        .catch(err => {
          setForm({
            ...form,
            lookupInfo: {},
            lookupError: `Error calling lookup service: ${err.message}`
          });
        })
        .finally(() => {
          updateLoading({
            ...loading,
            lookupUser: false
          });
        });
    }
  }, [form.nNumber]);

  useEffect(() => {
    if (JSON.stringify(form.lookupInfo) !== JSON.stringify({}) && form.team !== "" && form.manager !== "" && form.outgoing !== "") {
      setFormReady(true);
    } else {
      setFormReady(false);
    }
  }, [form]);

  const clearUser = () => {
    setForm({
      ...form,
      lookupError: null,
      lookupInfo: {},
      nNumber: "N"
    });
    setDisableNNumber(false);
  };

  const saveUser = () => {
    updateLoading({
      ...loading,
      saveStatus: "saving",
      saveUser: true
    });
    const parsedManager = JSON.parse(form.manager);
    myAxios
      .post(apiPaths.CREATE_WORKER, {
        attributes: {
          did: `+1${form.outgoing.replace(/[\D]/g, "")}`,
          email: form.lookupInfo.email,
          full_name: `${form.lookupInfo.firstName} ${form.lookupInfo.lastName}`,
          manager_first_name: parsedManager.manager_first_name,
          manager_last_name: parsedManager.manager_last_name,
          manager_n_number: parsedManager.manager_n_number,
          n_number: form.nNumber,
          office_location_name: form.lookupInfo.officeName,
          office_location_number: form.lookupInfo.officeNumber,
          primary_dept_name: form.lookupInfo.departmentName,
          primary_dept_number: form.lookupInfo.departmentNumber,
          profile_id: form.team
        }
      })
      .then(res => {
        clearUser();
        updateLoading({
          ...loading,
          saveStatus: "success",
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, 2000);
        console.log(res);
      })
      .catch(err => {
        updateLoading({
          ...loading,
          saveStatus: "fail",
          saveUser: true
        });
        setTimeout(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, 2000);
        console.log(err);
      });
  };

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ?
          <ModalOverlay
            status={loading.saveStatus}
            successMessage={"User Added Successfully"}
            failMessage={"Failed To Add User"}
          /> : null}
        <ModalHeader>Add a User</ModalHeader>
        <CustomSelect
          label={"Manager"}
          labelWidth={65}
          optionsList={managerList}
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
        <CustomSelect
          label={"Team"}
          labelWidth={41}
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
          outgoingNumber={form.outgoing}
          updateValue={newValue => setForm({
            ...form,
            outgoing: newValue
          })}
        />
        <FlexColumn>
          <ModalNNumber
            disabled={disableNNumber}
            loading={loading.lookupUser}
            nNumber={form.nNumber}
            updateValue={newValue => setForm({
              ...form,
              nNumber: newValue
            })}
          />
          <ModalHelperText
            clearUser={clearUser}
            error={form.lookupError}
            lookupInfo={form.lookupInfo}
          />
        </FlexColumn>
        <ButtonWrapper>
          <CustomButton disabled={!formReady} onClick={saveUser}>
            Add User
          </CustomButton>
          <CustomButton onClick={handleClose}>Close</CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

AddUserModal.propTypes = {
  handleClose: PropTypes.func,
  managerList: PropTypes.arrayOf(
    PropTypes.shape({
      manager_first_name: PropTypes.string,
      manager_last_name: PropTypes.string,
      manager_n_number: PropTypes.string
    })
  )
};

export default AddUserModal;