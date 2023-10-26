import { myAxios } from "./myAxios";

export const env = new Map<string, string>();

export const getEnvVariables = async (): Promise<Map<string, string>> => {
  if (!env.size) {
    try {
      let data;

      if(process.env.APP_ENV === "local") {
        data = process.env;
      } else {
        ({ data } = await myAxios.get("/triton-admin/config/env") as { data: { [key: string]: string } });
      }

      Object.entries(data).forEach(([key, value]) => {
        env.set(key, value);
      });
    } catch(error) {
      // Using logger here would create a circular dep
      console.error("Failed to get Env variables", error);

      // Add process variables if in a local env
      Object.entries(process.env).forEach(([key, value]) => {
        env.set(key, value);
      });

      // So it won't try to make the request again
      env.set("ERROR", "ERROR");
    }
  }

  return env;
};
