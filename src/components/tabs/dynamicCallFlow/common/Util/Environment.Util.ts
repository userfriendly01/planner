import { env } from "globals/index";

export const IS_LOCAL_ENV = env.APP_ENV === "local";
