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
// import { AzureSPA } from "../../../../../globals";
// import { FloatingHeader } from "@lmig/lmds-react-floating-header";
// import { hasDuplicatePhoneNumberRecord } from "../GraphQL/Match.PhoneNumber.Records.Util";
// import { GREETING_MESSAGES } from "../Form/Dynamic.PhoneNumber.Form.Fields";
// import { SingleCallFlowRecord } from "../GraphQL/Single.PhoneNumber.Record.Util";
// import { checkForDuplicateErrorMessage } from "../../common/GraphQL/GraphQL.Util";
// import { LegacyPhoneNumberFormFieldConfigs } from "../Form/Legacy.PhoneNumber.Form.FieldConfigs";
// import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumber.DataGrid.Manager";
// import { ViewListIconToggleForm } from "../../common/Form/ViewList.IconToggle.Form";
// import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";
// import { PhoneNumberFormManager } from "../Form/PhoneNumber.Form.Manager";
// import {
//   FieldConfig, FieldDataType, FieldDataTypeEnum, Fields
// } from "../../common/Form/Form.FieldConfig.State";
// import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
// import { NOT_VALID } from "../../common/Form/Abstract.Form.Handler";
//
// export interface AddPhoneNumberModalProps {
//   dataGridManager: PhoneNumberDataGridManager,
//   formManager: PhoneNumberFormManager;
// }
//
// //TODO: JSX is deprecated, need to research what to do.  import {JSX} from 'react'
// export const AddPhoneNumber = ({
//   accessToken, dataGridManager, formManager
// }: AddPhoneNumberModalProps & AzureSPA):JSX.Element => {
//
//   const [formRecord, setFormRecord] = React.useState<PhoneNumberRecordType>({});
//
//   useEffect(() => {
//     formManager.resetForm();
//   }, []);
//
//   useEffect(()=> {
//     //TODO: Not sure why it was setting itself to itself?  Is this supposed to reset to initial state?
//     // setFlowRule((rule: FormValidationRule) => ({
//     //   ...rule
//     // }));
//
//     // if (cloneType) {
//     //   formManager.fieldConfigs.state = clonedFormFields;
//     // }
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
//     if(valuePassed && typeof(valuePassed) === "string"){
//       value = valuePassed;
//     } else{
//       value = event.target.value;
//     }
//
//     value = (key === "pkey" && !value.startsWith("+")) ? `+1${value}` : value;
//     const updatedRecord = PhoneNumberRecordUtil.setPropertyValue(formRecord, key, value);
//     setFormRecord(updatedRecord);
//
//     formManager.formFieldConfig.state = {
//       [key]: {
//         ...formManager.formFieldConfig.state[key as keyof Fields],
//         isValid: !isInvalidFormField(key, value)
//       }
//     };
//   }
//
//   function isValidFormField(key: string, value: FieldDataType): boolean {
//     const IS_VALID = true;
//     const NOT_VALID = false;
//     const formFieldConfig = LegacyPhoneNumberFormFieldConfigs[key];
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
//     if (LegacyPhoneNumberFormFieldConfigs[key]?.fieldConditionCheck) {
//       return LegacyPhoneNumberFormFieldConfigs[key].fieldConditionCheck(formManager.formFieldConfig.state);
//     } else {
//       // If there isn't a fieldConditionCheck, then the field condition is always valid
//       return true;
//     }
//   }
//
//   function isValidRecord() {
//     let isValidForm = true;
//
//     Object.keys(formManager.formFieldConfig.state).forEach((key: string) => {
//       if (isInvalidFormField(key, formRecord[key as keyof PhoneNumberRecordType]) && isFieldConditionMet(key)) {
//         isValidForm = false;
//         formManager.formFieldConfig.state = {
//           [key]: {
//             ...formManager.formFieldConfig.state[key as keyof Fields],
//             isValid: isValidForm
//           }
//         };
//       }
//     });
//
//     return isValidForm;
//   }
//
//   function resetFormFields() {
//     formManager.formFieldConfig.reset();
//     dataGridManager.openAddModal(false);
//   }
//
//   const handleOnSave = async (): Promise<void> => {
//     if (isValidRecord()) {
//       // const newCallFlowRecord = convertFormFieldToPhoneNumberRecord(formManager.fieldConfigs.state);
//
//       if (hasDuplicatePhoneNumberRecord(dataGridManager.dataGrid.data, formRecord, dataGridManager.alertBar)) {
//         return;
//       }
//
//       const singleCallFlowResults = await SingleCallFlowRecord.create(accessToken, formRecord);
//
//       if (!singleCallFlowResults.errors) {
//         dataGridManager.openAddModal(false, true, singleCallFlowResults.record);
//         dataGridManager.alertBar.success("New call flow has been successfully added.");
//
//         formManager.formFieldConfig.reset();
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
//             ["Liberty Mutual", "Safeco"].includes(formRecord.brand as string)?
//               (<FloatingHeader brand={BrandName[formRecord.brand as string]} overlayIsOpen>
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
//               Array.from<string>(Object.keys(LegacyPhoneNumberFormFieldConfigs)).map((key: string) => {
//                 const {
//                   label, required = false, fieldConditionCheck, isUserAbleToChangeControl, gridSize = 12
//                 }: FieldConfig = LegacyPhoneNumberFormFieldConfigs[key];
//
//                 if(fieldConditionCheck && !fieldConditionCheck(formManager.formFieldConfig.state)) {
//                   return;
//                 }
//
//                 return (
//                   <Grid container key = {key} item xs = {4}>
//                     <Grid key = {key} item xs = {gridSize}>
//                       <ComponentControl
//                         control={formManager.changeFormFieldControl.current(key)}
//                         name={key}
//                         label={label}
//                         type="text"
//                         value={formRecord[key as keyof PhoneNumberRecordType]}
//                         error={formManager.formFieldConfig.state[key].isValid === NOT_VALID}
//                         dropDownOptions={formManager.formFieldConfig.state[key].options}
//                         onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?:string) => handleInputChange(event,value,key)}
//                         required={required}
//                       />
//                     </Grid>
//                     {(isUserAbleToChangeControl)?(<Grid item xs={1}>
//                       <ViewListIconToggleForm field = {key} formFieldControl= {formManager.changeFormFieldControl} ></ViewListIconToggleForm>
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
