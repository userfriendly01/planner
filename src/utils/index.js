export * from "./authUtils";
export * from "./filterTable";
export * from "./calabrioUtils";
export * from "./formatManagersResponse";
export * from "./formatOfficesResponse";
export * from "./profileUtils";
export * from "./configUtils";
export * from "./flowUtils";
export * from "./formatNumberUtils";
export * from "./formatWorkerResponse";
export * from "./formatWorkerAttributeSkillsToHTML";
export * from "./isErrorIn400s";
export * from "./myAxios";
export * from "./routingUtils";
export * from "./skillsUtils";
export * from "./sortUtils";
export * from "./timeUtils";
export * from "./userFormUtils";
export * from "./profileFormUtils";
export * from "./userTokenUtils";

export const escapeQuotes = payload => {
  const replaceAll = (string, search, replace) => {
    return string.split(search).join(replace);
  };
  let finalPayload = payload;
  finalPayload = replaceAll(finalPayload, "'", "\\'");
  finalPayload = replaceAll(finalPayload, "\"", "\\\"");
  return finalPayload;
};