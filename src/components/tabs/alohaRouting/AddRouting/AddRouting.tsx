import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Modal, ModalHeader } from "@lmig/lmds-react-modal";
import { routingDropDownList, getAccessToken, getGraphQLEndpoint, routingInitRule, routeFields } from "utils";
import { getGridMasterData } from "../DataGridRouting/GridMaster";
import { retrieveRoutingData, addRoutingRule } from "services"
import { CctSharedCallRoutingGlobalDb, RoutingMasterData, RoutingDropDownList, RoutingInitRule, AddRoutingModalProps } from "../AlohaRouting.Interfaces";
import ComponentControl from "../../../core/SharedComponents/ComponentControl";
import { RoutingModalBodyStyled, RoutingModalFooterStyled, RoutingHeadingStyled } from "../AlohaRouting.Styles";
import CustomToast from "../../../core/CustomToast/CustomToast";



export const AddRouting = (props: AddRoutingModalProps) => {
    const {
        onClose, isOpen = false, newId, openModal
    } = props;

    const [routingRule, setRoutingRule] = useState({ ...routingInitRule });
    const [dropDownValues, setDropDownValues] = useState(routingDropDownList);
    const [alertBar, setAlertBar] = useState({
        "open": false,
        "msg": "",
        "severityType": ""
    });

    const accessToken: string = getAccessToken();
    const graphQlApiUrl: string = getGraphQLEndpoint();

    const masterDataValues = async (): Promise<RoutingDropDownList> => {
        let masterData: RoutingMasterData;
        const cachedMasterData: string | undefined = localStorage.getItem("ROUTING_MASTER_DATA");
        if (cachedMasterData !== undefined && cachedMasterData !== null) {
            masterData = JSON.parse(cachedMasterData);
        } else {
            const result: CctSharedCallRoutingGlobalDb[] = await retrieveRoutingData(accessToken, graphQlApiUrl);
            masterData = getGridMasterData(result);
        }
        routingDropDownList.brand = masterData.brand;
        routingDropDownList.channel = masterData.channel;
        routingDropDownList.policyType = masterData.policyType;
        return routingDropDownList;
    };

    const resetRoutingRule = () => {
        setRoutingRule({ ...routingInitRule });
        onClose(false);
    }

    useEffect(() => {
        masterDataValues().then((masterData: RoutingDropDownList) => {
            setDropDownValues(masterData);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateRoute = () => {
        let isValidForm: boolean = true;
        Object.keys(routingRule).map((key) => {
            if (routingRule[key].required && [undefined, '', null].includes(routingRule[key].value)) {
                const newRoutingRule = { [key]: { ...routingRule[key], error: true } };
                isValidForm = false;
                setRoutingRule((rule) => ({
                    ...rule,
                    ...newRoutingRule,
                }));
            }
            return true;
        });
        return isValidForm;
    }

    const handleOnCreateRoute = () => {
        const isValidForm = validateRoute();
        if (isValidForm) {
            addRoutingRule(routingRule, accessToken, graphQlApiUrl).then((apiResponse) => {
                if (!apiResponse.errors) {
                    openModal(false);
                    setRoutingRule({ ...routingInitRule });
                    setAlertBar(alertBarProps => ({
                        ...alertBarProps,
                        "open": true,
                        "severityType": "success",
                        "msg": "New Routing Rule has been successfully added!!"
                    }));
                    return true;
                }
                setAlertBar(alertBarProps => ({
                    ...alertBarProps,
                    "open": true,
                    "severityType": "error",
                    "msg": apiResponse.errors[0].message
                }));
            });
        }
        return false;
    }

    const TimeEvaluator = (event: any, keyType: string): string => {
        const timePicked = new Date(event.$d.toString());
        timePicked.setSeconds(0);
        if (keyType === 'endTime') {
            timePicked.setSeconds(timePicked.getSeconds() - 1);
        }
        return timePicked.toISOString();
    };

    const removeAllWhiteSpace = (value: string): string => {
        return value.split(" ").join("")
    }

    const handleInputChange = (event: any, key: string, disableEdit: boolean) => {
        let value: string;
        let skey: string;

        if (disableEdit) return;

        if (key === 'startTime' || key === 'endTime') {
            value = TimeEvaluator(event, key);
        } else {
            value = event.target.value;
        }

        if (key === 'channel' && value) {
            skey = routingRule.brand.value ? `${routingRule.brand.value}__` : '__';
            skey += `${value}__${newId}`;
        }

        if (key === 'brand' && value) {
            skey = `${value}__`;
            skey += routingRule.channel.value ? `${routingRule.channel.value}__${newId}` : `__${newId}`;
        }

        const newRoutingRule: RoutingInitRule = { [key]: { value } };

        if (skey) {
            newRoutingRule["skey"] = { value: removeAllWhiteSpace(skey).toLocaleLowerCase() };
        }

        if (key === 'callIntent' && value) {
            newRoutingRule["pkey"] = { value: removeAllWhiteSpace(value).toLocaleLowerCase() };
        }

        setRoutingRule((rule: RoutingInitRule) => ({
            ...rule,
            ...newRoutingRule,
        }));
    }

    const handleClose = (flag: boolean) => {
        setAlertBar(alertBarProps => ({
            ...alertBarProps,
            "open": flag
        }));
    };

    return (
        <div>
            <Modal
                size="large"
                className="route-table-modal-wrapper"
                takeover={['base', 'sm', 'md', 'lg']}
                isOpen={isOpen}
                onClose={() => {
                    resetRoutingRule();
                }}
            >
                <ModalHeader><RoutingHeadingStyled type="h4-light">{`Add Routing Rule (Rule ID #${newId})`}</RoutingHeadingStyled></ModalHeader>
                <RoutingModalBodyStyled>
                    <Grid container rowSpacing={3}>
                        {
                            routeFields.map(({
                                label, key, control, required = false, disableEdit = false
                            }) => {
                                let dropDownOptions: string[] = [];
                                if (control === 'select') {
                                    dropDownOptions = dropDownValues[key as keyof RoutingDropDownList];
                                }

                                return (
                                    <Grid key={key} item xs={4}>
                                        <ComponentControl
                                            control={control}
                                            name={key}
                                            label={label}
                                            type="text"
                                            value={routingRule[key].value}
                                            error={routingRule[key].error}
                                            disabled={disableEdit}
                                            dropDownOptions={dropDownOptions}
                                            onChange={(event: any) => handleInputChange(event, key, disableEdit)}
                                            required={required}
                                        />
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </RoutingModalBodyStyled>
                <RoutingModalFooterStyled>
                    <Button
                        type="submit"
                        value="Save"
                        variant="contained"
                        color="primary"
                        sx={{ marginRight: 2 }}
                        onClick={() => handleOnCreateRoute()}
                    >
                        Create Rule
                    </Button>
                    <Button
                        value="Cancel"
                        variant="outlined"
                        color="primary"
                        onClick={() => resetRoutingRule()}
                    >
                        Cancel
                    </Button>
                </RoutingModalFooterStyled>
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