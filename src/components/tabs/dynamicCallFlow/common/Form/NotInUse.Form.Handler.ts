// import {
//   AbstractFormHandler
// } from "./Abstract.Form.Handler";
//
// const MODAL_NAME = "NotInUse";
// const MODAL_LABEL = "This shouldn't be visible, only in use when form modal is not open";
//
// /**
//  * This Class is used as a placeholder for when the form is not in use.  The form can switch to different modes (i.e. add, edit).
//  * The React form needs a handler to render the form modal on load even though it isn't visible.  This is used rather than setting
//  * to the add or edit form when they aren't in use.  This design can be revisited when more time is available.  But for now, this
//  * will do.
//  */
// export class NotInUseFormHandler<RecordType> extends AbstractFormHandler<RecordType> {
//   constructor() {
//     super(undefined, undefined);
//   }
//   get modalName(): string {
//     return MODAL_NAME;
//   }
//
//   get modalLabel(): string {
//     return MODAL_LABEL;
//   }
//
//   get displayCloneButton(): boolean {
//     return false;
//   }
//
//   get displayDeleteButton(): boolean {
//     return false;
//   }
//
//   handleOnClone() {
//     // handle on clone
//   }
//
//   async handleOnSave(): Promise<void> {
//     // not in use
//   }
//
//   handleOnCancel(): void {
//     // not in use
//   }
//
//   handleOnClose(): void {
//     // not in use
//   }
//
//   handleOnDelete(): void {
//     // not in use
//   }
// }