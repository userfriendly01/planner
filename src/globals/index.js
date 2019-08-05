const SERVICE_BASE_URI = "/service";

export const apiPaths = {
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  GET_WORKERS_BY_PROFILEID: id => `${SERVICE_BASE_URI}/workers/profile/${id}`
};
