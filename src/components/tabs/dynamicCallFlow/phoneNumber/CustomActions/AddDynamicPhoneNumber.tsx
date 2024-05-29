// /* eslint-disable react/prop-types */
//
// import React, {
//   useEffect
// } from "react";
// import {
//   Modal, ModalHeader
// } from "@lmig/lmds-react-modal";
// import Grid from "@mui/material/Grid";
// import Button from "@mui/material/Button";
// import {
//   ComponentControl, CustomToast
// } from "components";
// import {
//   HeadingStyled, ModalBodyStyled, ModalFooterStyled
// } from "../DynamicCallFlowPhoneNumber.Styles";
// import {
//   BrandName
// } from "utils";
// import { AzureSPA } from "../../../../globals";
// import { FloatingHeader } from "@lmig/lmds-react-floating-header";
// import { convertFormFieldToPhoneNumberRecord } from "../Utils/FormValidationRuleUtil";
// import { hasDuplicatePhoneNumberRecord } from "../DataGrid/Util/MatchPhoneNumberRecords.Util";
// import { GREETING_MESSAGES } from "../Form/DynamicPhoneNumberFields";
// import { SingleCallFlowRecord } from "../GraphQL/Util/SinglePhoneNumberRecord.Util";
// import { checkForDuplicateErrorMessage } from "../../../../common/GraphQL/GraphQLUtil";
// import { LegacyPhoneNumberFieldConfigs } from "../Form/LegacyPhoneNumberFieldsConfig";
// import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";
// import { ViewListIconToggle } from "../../../../common/Form/ViewListIconToggle";
// import { PhoneNumberRecordUtil } from "../GraphQL/Util/PhoneNumberRecordUtil";
// import { LegacyPhoneNumberFormManager } from "../Form/LegacyPhoneNumberForm.Manager";
// import {
//   FieldConfig,
//   FieldDataType, FieldDataTypeEnum, Fields
// } from "../../../../common/Form/FieldConfigState.Manager";
// import {ControlEnum} from "../../../../common/Form/FieldControl";
//
// export interface AddPhoneNumberModalProps {
//   cloneType?: boolean;
//   clonedFormFields?: Fields;
//   dataGridManager: PhoneNumberDataGridManager,
//   formManager: LegacyPhoneNumberFormManager;
// }
//
// //TODO: JSX is deprecated, need to research what to do.  import {JSX} from 'react'
// export const AddDynamicPhoneNumber = ({
//   accessToken, cloneType, clonedFormFields, dataGridManager, formManager
// }: AddPhoneNumberModalProps & AzureSPA):JSX.Element => {
//
//   useEffect(() => {
//     formManager.fieldControl.reset();
//   }, []);
//
//   useEffect(()=> {
//     //TODO: Not sure why it was setting itself to itself?  Is this supposed to reset to initial state?
//     // setFlowRule((rule: FormValidationRule) => ({
//     //   ...rule
//     // }));
//
//     if (cloneType) {
//       formManager.fields.state = clonedFormFields;
//     }
//   },[dataGridManager.openAddModal]);
//
//   const handleClose = (flag: boolean) => {
//     dataGridManager.alertBar.open = flag;
//   };
//
//   //TODO: Should valuePassed be a string?
//   function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, valuePassed?:string, key?:string) {
//     let value: string;
//
//     if(valuePassed && typeof(valuePassed) === "string" && formManager.fieldControl.state[key].current === ControlEnum.Input){
//       value = valuePassed;
//     } else{
//       value = event.target.value;
//     }
//
//     value = (key === "pkey" && !value.startsWith("+")) ? `+1${value}` : value;
//
//     formManager.fields.state = {
//       [key]: {
//         ...formManager.fields.state[key as keyof Fields],
//         value,
//         error: isInvalidFormField(key, value)
//       }
//     };
//   }
//
//   function isValidFormField(key: string, value: FieldDataType): boolean {
//     const IS_VALID = true;
//     const NOT_VALID = false;
//     const formFieldConfig = LegacyPhoneNumberFieldConfigs[key];
//
//     if (!formFieldConfig.required) {
//       return IS_VALID;
//     }
//
//     if (!value) {
//       return NOT_VALID;
//     }
//
//     switch(formFieldConfig.dataType) {
//       case FieldDataTypeEnum.STRING:
//         if ((value as string).length === 0) {
//           return NOT_VALID;
//         }
//
//         if (key === GREETING_MESSAGES) {
//           return PhoneNumberRecordUtil.isValidGreetingMessage(value as string);
//         }
//
//         return IS_VALID;
//       case FieldDataTypeEnum.STRING_ARRAY:
//         return (value as Array<string>).length > 0 ? IS_VALID : NOT_VALID;
//       case FieldDataTypeEnum.BOOLEAN:
//         return IS_VALID;
//       default:
//         return NOT_VALID;
//     }
//   }
//
//   function isInvalidFormField(key: string, value: FieldDataType): boolean {
//     return !isValidFormField(key, value);
//   }
//
//   //TODO: Add validation
//   function isFieldConditionMet(key: string): boolean {
//     if (LegacyPhoneNumberFieldConfigs[key]?.fieldConditionCheck) {
//       return LegacyPhoneNumberFieldConfigs[key].fieldConditionCheck(formManager.fields.state);
//     } else {
//       // If there isn't a fieldConditionCheck, then the field condition is always valid
//       return true;
//     }
//   }
//
//   function isValidRecord() {
//     let isValidForm = true;
//
//     Object.keys(formManager.fields.state).forEach((key: string) => {
//       if (isInvalidFormField(key, formManager.fields.state[key].value) && isFieldConditionMet(key)) {
//         isValidForm = false;
//         formManager.fields.state = {
//           [key]: {
//             ...formManager.fields.state[key as keyof Fields],
//             error: true
//           }
//         };
//       }
//     });
//
//     return isValidForm;
//   }
//
//   function resetFormFields() {
//     formManager.fields.reset();
//     dataGridManager.openAddModal(false);
//   }
//
//   const handleOnSave = async (): Promise<void> => {
//     if (isValidRecord()) {
//       const newCallFlowRecord = convertFormFieldToPhoneNumberRecord(formManager.fields.state);
//
//       if (hasDuplicatePhoneNumberRecord(dataGridManager.dataGrid.data, newCallFlowRecord, dataGridManager.alertBar)) {
//         return;
//       }
//
//       const singleCallFlowResults = await SingleCallFlowRecord.create(accessToken, newCallFlowRecord);
//
//       if (!singleCallFlowResults.errors) {
//         dataGridManager.openAddModal(false, true, singleCallFlowResults.record);
//         dataGridManager.alertBar.success("New call flow has been successfully added.");
//
//         formManager.fields.reset();
//       } else {
//         checkForDuplicateErrorMessage(singleCallFlowResults.errors);
//         dataGridManager.alertBar.error(singleCallFlowResults.errors.join("\n"));
//       }
//     }
//   };
//
//   return (
//     <div>
//       <Modal
//         isOpen={dataGridManager.dataGrid.isAddModalOpen}
//         size="large"
//         takeover={["base", "sm", "md", "lg"]}
//         className="route-table-modal-wrapper"
//         onClose={() => {
//           resetFormFields();
//         }}
//       ><ModalHeader>
//           {
//             ["Liberty Mutual", "Safeco"].includes(formManager.fields.state?.brand?.value as string)?
//               (<FloatingHeader brand={BrandName[formManager.fields.state?.brand?.value as string]} overlayIsOpen>
//                 <HeadingStyled type="h4-light">Add Flow Rule</HeadingStyled>
//               </FloatingHeader>):
//               (
//                 <HeadingStyled type="h4-light">Add Flow Rule
//                 </HeadingStyled>
//               )
//           }
//         </ModalHeader>
//         <ModalBodyStyled >
//           <Grid container rowSpacing={3}>
//             {
//               Array.from<string>(Object.keys(LegacyPhoneNumberFieldConfigs)).map((key: string) => {
//                 const {
//                   label, required = false, fieldConditionCheck, isUserAbleToChangeControl, gridSize = 12
//                 }: FieldConfig = LegacyPhoneNumberFieldConfigs[key];
//
//                 if(fieldConditionCheck && !fieldConditionCheck(formManager.fields.state)) {
//                   return;
//                 }
//
//                 return (
//                   <Grid container key = {key} item xs = {4}>
//                     <Grid key = {key} item xs = {gridSize}>
//                       <ComponentControl
//                         control={formManager.fieldControl.current(key)}
//                         name={key}
//                         label={label}
//                         type="text"
//                         value={PhoneNumberRecordUtil.getPropertyValue(selec)}
//                         error={formManager.fields.state[key].error}
//                         dropDownOptions={formManager.fieldOptions.get(key)}
//                         onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?:string) => handleInputChange(event,value,key)}
//                         required={required}
//                       />
//                     </Grid>
//                     {(isUserAbleToChangeControl)?(<Grid item xs={1}>
//                       <ViewListIconToggle field = {key} formFieldControl = {formManager.fieldControl} ></ViewListIconToggle>
//                     </Grid>):(<div></div>)}
//                   </Grid>
//                 );
//               })
//             }
//           </Grid>
//         </ModalBodyStyled>
//         <ModalFooterStyled >
//           <Button
//             type="submit"
//             variant="contained"
//             value="Save"
//             color="primary"
//             sx={{ marginRight: 2 }}
//             aria-label = "createRuleButton"
//             onClick={() => handleOnSave()}
//           >
//             Create Rule
//           </Button>
//           <Button
//             value="Cancel"
//             variant="outlined"
//             color="primary"
//             aria-label = "resetRuleButton"
//             onClick={() => resetFormFields()}
//           >
//             Cancel
//           </Button>
//         </ModalFooterStyled>
//       </Modal>
//       <CustomToast
//         open={dataGridManager.alertBar.open}
//         onClose={handleClose}
//         msg={dataGridManager.alertBar.msg}
//         severityType={dataGridManager.alertBar.severityType}
//       />
//     </div>
//   );
// };
//
//
//
