import React, { useState, useEffect } from "react";
import { Modal, ModalHeader } from "@lmig/lmds-react-modal";
import { Button, Grid } from "@mui/material";
import { HeadingStyled, ModalBodyStyled, ModalFooterStyled } from "../AlohaFlow.Styles";
import {
    CctSharedCallFlowDb,
    FlowDropDownList,
    FlowInitState,
    FlowKeys,
    FlowMasterData
} from "../AlohaFlow.Interfaces";
import { flowFields, initRule } from "../CustomActions/AddFlow/FlowFieldsConfig";
import { CustomToast } from "components";
import {
    flowDropDownList,
    FLOW_MASTER_DATA,
    getAccessToken,
    initializedAlertBar,
    languageOffer,
    userDestination
} from "utils";
import ComponentControl from "components/core/SharedComponents/ComponentControl";

interface EditFlowComponentProps {
    isOpen: boolean;
    selectedRow: CctSharedCallFlowDb;
    openEditModal: (flag: boolean) => void;
}
export const EditFlow = ({ isOpen = false, selectedRow, openEditModal }: EditFlowComponentProps) => {
    const accessToken: string = getAccessToken();
    const [selectedRowLocal, setSelectedRowLocal] = useState({});
    const [updateDataReq, setUpdateDataReq] = useState('');
    const [displayRecords, setDisplayRecords] = useState(false);
    const [flowRule, setFlowRule] = useState({ ...initRule });
    const [dropDownValues, setDropDownValues] = useState(flowDropDownList);
    const [alertBar, setAlertBar] = useState(initializedAlertBar);


    useEffect(() => {
        setSelectedRowLocal(selectedRow);
        setUpdateDataReq('');
        setDisplayRecords(false);
        const masterDataStorage: string = localStorage.getItem(FLOW_MASTER_DATA);
        const masterData: FlowMasterData = JSON.parse(masterDataStorage);
        setDropDownValues((dropDownOptions: FlowDropDownList) => (
            {
                ...dropDownOptions,
                "brand": masterData.brand,
                "channel": masterData.channel,
                "languageOffer": languageOffer,
                "userDestinaton": userDestination
            })
        )
    }, [selectedRow]);

    const handleOnSave = () => {

    }

    const handleOnDelete = () => {

    }

    const handleCancel = () => {

        openEditModal(false);
    }

    const handleClose = () => {

    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const fieldName = event.target.name;
        setSelectedRowLocal((selectRowLocal: CctSharedCallFlowDb) => ({
            ...selectRowLocal,
            DRC: {
                ...selectRowLocal.DRC,
                [event.target.name]: event.target.value,
            },
        }));
        setSelectedRowLocal((selectRowLocal: CctSharedCallFlowDb) => ({
            ...selectRowLocal,
            content: {
                ...selectRowLocal.content,
                [event.target.name]: event.target.value,
            },
        }));
        setSelectedRowLocal((selectRowLocal: CctSharedCallFlowDb) => ({
            ...selectRowLocal,
            [event.target.name]: event.target.value,
        }));

    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                size="large"
                takeover={['base', 'sm', 'md', 'lg']}
                className="route-table-modal-wrapper"
                onClose={() => {
                    openEditModal(false);
                }}
            >
                <ModalHeader><HeadingStyled type="h4-light">{`Update Flow Rule ${selectedRow && selectedRow.pkey}`}</HeadingStyled></ModalHeader>
                <ModalBodyStyled>
                    <Grid container rowSpacing={3}>
                        {
                            flowFields.map(({
                                label, key, control, required = false
                            }) => {
                                return (
                                    <Grid key={key} item xs={4}>
                                        <ComponentControl
                                            control={control}
                                            name={key}
                                            label={label}
                                            type="text"
                                            value={flowRule[key as keyof FlowKeys].value}
                                            error={flowRule[key as keyof FlowKeys].error}
                                            dropDownOptions={dropDownValues[key as keyof FlowDropDownList] || []}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(event)}
                                            required={required}
                                        />
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </ModalBodyStyled>
                <ModalFooterStyled>
                    <Button
                        variant="contained"
                        value="Save"
                        color="primary"
                        sx={{ marginRight: 2 }}
                        onClick={() => handleOnSave()}
                    >
                        Save Rule
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        value="Delete"
                        sx={{ marginRight: 2 }}
                        onClick={() => handleOnDelete()}
                    >
                        Delete Rule
                    </Button>
                    <Button
                        value="Cancel"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleCancel()}
                    >
                        Cancel
                    </Button>
                </ModalFooterStyled>
            </Modal>
            <CustomToast
                open={alertBar.open}
                onClose={handleClose}
                msg={alertBar.msg}
                severityType={alertBar.severityType}
            />
        </div>
    )
}
