const SERVICE_BASE_URI = "/service";

export const apiPaths = {
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  GET_WORKER_BY_ID: nNum => `${SERVICE_BASE_URI}/workers/id/${nNum}`,
  GET_WORKERS_BY_PROFILEID: id => `${SERVICE_BASE_URI}/workers/profile/${id}`
};
