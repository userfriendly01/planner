import { apiPaths }from "globals";
import {
  DbWorker,
  myAxios
} from "utils";

export const createUser = (worker: Partial<DbWorker>): Promise<DbWorker> =>
  myAxios.post(apiPaths.CREATE_WORKER, worker)
    .then(response => response.data);


// export const getJokes = (): Promise<any> =>
//   myAxios.get("https://api.api-ninjas.com/v1/dadjokes?limit=50", {
//     headers: {
//       "X-Api-Key": "8+2sNBDb/4jPvGZsP2PfyQ==HfMAyz4obaxX8nt5"
//     }
//   }).then(response => response.data).catch(err => console.error("Aww no jokes", err));