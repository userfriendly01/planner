import {
  ManagerModalButtonWrapper,
  Header,
  CloseButtonContainer,
  ModalContainer,
  Wrapper,
  Header4
} from "./ManagerModal.Styles";
import {
  defaultNNumber,
  DropdownOption,
  ManagerModalProps
} from "./ManagerModal.Interfaces";
import {
  Dropdown,
  NNumberInput,
  ModalOverlay,
  StyledButton,
  CalabrioTeamModal,
  PaperContainer
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import {
  FlexColumn,
  Manager,
  ModalOverlayStatuses,
  UMUser
} from "globals";
import React, {
  useState, useEffect
} from "react";
import {
  addManager,
  editManager,
  FetchUserResponse,
  fetchUser,
  updateUser
} from "services";
import {
  logger,
  sortProfilesByName
} from "utils";
import {
  IconButton,
  Modal
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { StyledExportButton } from "components/tabs/callflowmanagement/SkillManagement/Skills.Styles";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ManagerModal = React.forwardRef((props: ManagerModalProps, ref: any): any => {
  const {
    handleClose,
    selectedManager
  } = props;

  const _export = React.useRef(null);

  const state = useAdminState();
  const { nNumber } = state.userContext;
  const profiles = state.profileContext.profiles;
  const calabrioTeams = state.calabrioContext.teams;
  const options: DropdownOption[] = [
    {
      label: "Add Calabrio Team",
      value: "add-team"
    },
    {
      label: "divider",
      value: "divider"
    },
    ...calabrioTeams.map((team: any) => ({
      label: team.name,
      value: team.groupId,
      ...team
    }))
  ];
  const [manager, setManager] = useState<Manager>(selectedManager ? selectedManager : null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<ModalOverlayStatuses>(null);
  const [managerNNumber, setManagerNNumber] = useState<string>(selectedManager ? selectedManager.manager_n_number : defaultNNumber);
  const [fetchedUser, setFetchedUser] = useState<FetchUserResponse>(null);
  const [ profile, setProfile ] = useState<any>(selectedManager ? profiles.find(p => p.profile_id === selectedManager.profile_id) : null);
  const [ selectedCalabrioTeams, setSelectedCalabrioTeams ] = useState<number[]>(selectedManager ? selectedManager.calabrio_team_ids :[]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [hasNameDiscrepancy, setHasNameDiscrepancy] = useState<boolean>(false);

  useEffect(() => {
    if (selectedManager) {
      checkForNameChange();
    }
  }, []);

  const checkForNameChange = () => {
    fetchUser(selectedManager.manager_n_number)
      .then(newlyFetchedManager => {
        if (selectedManager.manager_first_name !== newlyFetchedManager.firstName || selectedManager.manager_last_name !== newlyFetchedManager.lastName) {
          setHasNameDiscrepancy(true);
          setManager({
            manager_id: selectedManager.manager_id,
            manager_n_number: selectedManager.manager_n_number.toLowerCase(),
            manager_first_name: newlyFetchedManager.firstName,
            manager_last_name: newlyFetchedManager.lastName
          });
        }
      })
      .catch(error => {
        logger.error("Failed to fetch user from employee lookup service", {
          error,
          nNumber
        });
      });
  };


  const getCalabrioOption = (teamId: number): any => {
    const team = calabrioTeams.find(team => team.groupId === teamId);
    return team ? {
      ...team,
      value: team.groupId,
      label: team.name
    } : teamId;
  };
  const dispatch = useAdminDispatch();

  const handleOpenTeam = () => {
    setIsTeamModalOpen(true);
  };

  const handleCloseTeam = (newTeam: any) => {
    if(newTeam && newTeam.groupId){
      const newlist= [...selectedCalabrioTeams, newTeam.groupId];
      setSelectedCalabrioTeams(newlist.map((team:number) => team));
    }
    setIsTeamModalOpen(false);
  };

  const handleExport = (selected: UMUser[]) => {
    const columns = [
      {
        field: "n_number",
        title: "N-Number",
        width: "50px"
      },
      {
        field: "emp_first_name",
        title: "First Name",
        width: "200px"
      },
      {
        field: "emp_last_name",
        title: "Last Name",
        width: "200px"
      },
      {
        field: "message",
        title: "Failure message",
        width: "400px"
      }
    ];

    const rows = selected.map((w: any) => {
      return {
        emp_first_name: w.attributes.emp_first_name,
        emp_last_name: w.attributes.emp_last_name,
        n_number: w.attributes.n_number,
        message: "Failed to update manager name in agent's worker attributes"
      };
    });
    if (_export.current !== null) {
      _export.current.save(rows, columns);
    }
  };

  const addManagerClicked = (): Promise<any> => {
    setIsDisabled(true);
    setSaveStatus(ModalOverlayStatuses.SAVING);
    if (state.managerContext.managers.some((savedManager: Manager) => savedManager.manager_n_number.toLowerCase() === manager.manager_n_number)) {
      setSaveStatus(ModalOverlayStatuses.FAIL);
      setTimeout(() => setSaveStatus(null), 2000);
      setErrorMessage("Manager already exists");

      logger.warn("addManager - Failure - Manager Already exists", {
        managerNNumber: manager.manager_n_number
      }, false);

      setIsDisabled(false);
      return Promise.resolve("addManager - Failure - Manager Already exists");
    }
    const profileId = profile ? profile.profile_id : null;

    return addManager({
      manager_first_nme: manager.manager_first_name.replace("'", "\\'"),
      manager_last_nme: manager.manager_last_name.replace("'", "\\'"),
      manager_n_num: manager.manager_n_number,
      profile_id: profileId,
      calabrio_team_ids: JSON.stringify(selectedCalabrioTeams)
    })
      .then(res => {
        dispatch(({
          type: "addManager",
          payload: {
            ...manager,
            manager_id: res.insertId,
            profile_id: profileId,
            calabrio_team_ids: selectedCalabrioTeams
          }
        }));
        dispatch({
          type: "updateManagerFilter",
          payload: manager.manager_n_number
        });
        setSaveStatus(ModalOverlayStatuses.SUCCESS);
        setTimeout(handleClose, 2000);
        setIsDisabled(false);

        logger.info("Successfully created manager", {
          res,
          nNumber,
          managerNNumber: manager.manager_n_number
        });
      })
      .catch(error => {
        setSaveStatus(ModalOverlayStatuses.FAIL);
        setTimeout(() => setSaveStatus(null), 2000);
        setErrorMessage("Failed to Create Manager");
        setIsDisabled(false);

        logger.error("Failed to create manager", {
          error,
          nNumber,
          managerNNumber: manager.manager_n_number
        });
      });
  };

  const editManagerClicked = async (): Promise<any> => {
    setSaveStatus(ModalOverlayStatuses.SAVING);
    const profileId = profile ? profile.profile_id : null;
    const teams = JSON.stringify(selectedCalabrioTeams);

    try {
      const res = await editManager(selectedManager.manager_id, {
        manager_first_nme: manager.manager_first_name,
        manager_last_nme: manager.manager_last_name,
        profile_id: profileId,
        calabrio_team_ids: teams
      });
      const successes: UMUser[] = [];
      const failures: UMUser[] = [];
      if (hasNameDiscrepancy) {
        const affectedWorkers: UMUser[] = state.workerContext.workers.filter(worker => worker.attributes.manager_n_number === selectedManager.manager_n_number);
        const results = await Promise.allSettled(affectedWorkers.map(worker => {
          const body = {
            attributes: {
              ...worker.attributes,
              manager_first_name: manager.manager_first_name,
              manager_last_name: manager.manager_last_name,
              manager: `${manager.manager_first_name} ${manager.manager_last_name}`
            }
          };
          return updateUser(worker.sid, body);
        }));

        results.forEach((r, index) => {
          if (r.status === "fulfilled") {
            successes.push(affectedWorkers[index]);
          } else {
            failures.push(affectedWorkers[index]);
          }
        });
        if (successes.length) {
          // update the workerstate of the successful ones
          const updatedWorkers = state.workerContext.workers.map(w => {
            const workerToUpdate = successes.find(s => s.sid === w.sid);
            if (workerToUpdate) {
              return {
                ...w,
                attributes: {
                  ...w.attributes,
                  manager_first_name: manager.manager_first_name,
                  manager_last_name: manager.manager_last_name,
                  manager: `${manager.manager_first_name} ${manager.manager_last_name}`
                }
              };
            } else {
              return w;
            }
          });
          dispatch({
            type: "loadWorkers",
            payload: updatedWorkers
          });
        }
      }
      const updatedArray = state.managerContext.managers.map(m => {
        if(m.manager_id === manager.manager_id){
          return {
            ...manager,
            profile_id: profileId,
            calabrio_team_ids: selectedCalabrioTeams
          };
        } else {
          return m;
        }
      });

      dispatch(({
        type: "editManager",
        payload: updatedArray
      }));

      if (failures.length > 0) {
        setSaveStatus(ModalOverlayStatuses.PARTIAL_FAIL);
        const failUl = (<>
          <h4>
            Manager was successfully updated, but errors occurred while updating the worker attributes of their agents with the manager name change.
            <br/>
            Export the errors
          </h4>
          <StyledExportButton data-testid="export-button" onClick={() => handleExport(failures)} styles={{ width: "200px" }}><ExcelExport ref={_export} />Export Errors</StyledExportButton>
        </>);

        setErrorMessage(failUl);
        logger.warn("Some failures updating manager name in worker attributes while updating manager name", {
          nNumber,
          managerNNumber: manager.manager_n_number,
          failures,
          res
        });
      } else {
        setSaveStatus(ModalOverlayStatuses.SUCCESS);
        setTimeout(handleClose, 2000);
        logger.info("Successfully updated manager", {
          nNumber,
          managerNNumber: manager.manager_n_number,
          res
        });
      }

    } catch (error) {
      setSaveStatus(ModalOverlayStatuses.FAIL);
      setTimeout(() => setSaveStatus(null), 2000);
      setErrorMessage("Failed to update Manager");

      logger.error("Failed to update manager", {
        error,
        nNumber,
        managerNNumber: manager.manager_n_number
      });
    }
  };

  let overlayMessage = "Saving";
  if (saveStatus === ModalOverlayStatuses.SUCCESS) {
    overlayMessage = "Manager saved successfully";
  } else if (saveStatus === ModalOverlayStatuses.FAIL || saveStatus === ModalOverlayStatuses.PARTIAL_FAIL) {
    overlayMessage = errorMessage;
  }

  return (
    <ModalContainer ref={ref}>
      <PaperContainer>
        {saveStatus ?
          <ModalOverlay
            message={overlayMessage}
            status={saveStatus}
            handleClose={handleClose}
          /> : null}
        <CloseButtonContainer>
          <IconButton>
            <CloseRounded data-testid="close-button" onClick={handleClose} />
          </IconButton>
        </CloseButtonContainer>
        {selectedManager
          ? <Header>Edit {selectedManager.manager_first_name} {selectedManager.manager_last_name}</Header>
          : <Header>Add a Manager</Header>
        }
        <FlexColumn>
          {hasNameDiscrepancy&& (<Header4>A name change was detected for this manager.<br/>Save this form to update their name to {manager.manager_first_name} {manager.manager_last_name}.</ Header4>)}
          <NNumberInput
            disabled={saveStatus || selectedManager ? true : false}
            fetchedUser={fetchedUser}
            label="N Number"
            onComplete={(fetchedUser, newNNumber) => {
              setManagerNNumber(newNNumber);
              setManager({
                manager_n_number: newNNumber.toLowerCase(),
                manager_first_name: fetchedUser.firstName,
                manager_last_name: fetchedUser.lastName
              });
              setFetchedUser(fetchedUser);
            }}
            onClear={() => {
              setManagerNNumber(defaultNNumber);
              setManager(null);
            }}
            onUpdate={newNNumber => {
              setManagerNNumber(newNNumber);
            }}
            value={managerNNumber}
          />
          <Dropdown
            label={"Team *"}
            styles={{
              width: "400px",
              margin: "10px 0px"
            }}
            options={state.profileContext.profiles.sort(sortProfilesByName).map((profile: any) => ({
              label: profile.profile_nme,
              value: profile.profile_id,
              ...profile
            }))}
            value={profile && profile.profile_nme ? profile.profile_nme : ""}
            updateValue={(event: any, newValue: any) => setProfile(newValue)}
          />
          <Wrapper>
            <Dropdown
              multiple={true}
              label={"Calabrio Team Options *"}
              styles={{
                width: "400px",
                margin: "10px 0px"
              }}
              options={options}
              value={selectedCalabrioTeams.map((teamId:any) => getCalabrioOption(teamId))}
              updateValue={(event: any, newInputValue: any) => {
                if(newInputValue.some((t: any) => t.value === "add-team")){
                  handleOpenTeam();
                } else {
                  setSelectedCalabrioTeams(newInputValue.map((team:any) => team.value));
                }
              }}
            />
            <Modal onClose={() => { return; }} open={isTeamModalOpen}>
              <>
                <CalabrioTeamModal handleClose={handleCloseTeam}/>
              </>
            </Modal>
          </Wrapper>
        </FlexColumn>
        <ManagerModalButtonWrapper>
          { selectedManager ?
            <StyledButton disabled={!manager || !profile || selectedCalabrioTeams.length === 0} onClick={editManagerClicked} data-testid={"edit-manager-button"}>
                Save
            </StyledButton>
            : <StyledButton disabled={!manager || !profile || selectedCalabrioTeams.length === 0 || isDisabled} onClick={addManagerClicked} data-testid={"add-manager-button"}>
                Add Manager
            </StyledButton>
          }
        </ManagerModalButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
});

export default ManagerModal;
