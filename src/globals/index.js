const SERVICE_BASE_URI = "/service";

export const apiPaths = {
  GET_WORKERS_BY_PROFILEID: id => `${SERVICE_BASE_URI}/workers/profile/${id}`
};