import {
    UserEntryForm,
    BulkChanges,
    TritonUsersViewWrapper
} from "components";

export const getRoutes = () => [
  {
    path: "/triton-admin",
    element: TritonUsersViewWrapper
  },
  {
    path: "/triton-admin/triton-users",
    element: TritonUsersViewWrapper
  },
  {
    path: "/triton-admin/user",
    element: UserEntryForm
  },
  {
    path: "/triton-admin/bulk",
    element: BulkChanges
  }
]