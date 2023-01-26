import { apiPaths } from "globals";
import { SearchParams } from "../components/tabs/usermanagement/OnboardNewUser/Extension/ExtensionSearchParams";
import { myAxios } from "utils";

export const checkExtension = extension => myAxios.post(apiPaths.CHECK_EXTENSION, { extension })
  .then(res => {
    return res.data.isValid !== undefined ? res.data.isValid : false;
  });

const pickANumber = () => {
  const searchParams = SearchParams.getValues();
  let extNum = null;
  while (!extNum) {
    const oneNum = searchParams.MinExtensionNum + Math.floor((Math.random() * searchParams.ExtensionNumRange));
    if (searchParams.ReservedExtensions.indexOf(oneNum) === -1) {
      extNum = oneNum.toString();
    }
  }
  return extNum;
};

export const generateExtension = () => {
  const maxAttempts = 5;

  const validateGeneratedNumber = async attemptNumber => {
    const extension = pickANumber();
    const validExtension = await checkExtension(extension);
    if(validExtension){
      return Promise.resolve(extension);
    } else if(attemptNumber === maxAttempts) {
      return Promise.reject("Enable to generate extension");
    } else {
      return validateGeneratedNumber(attemptNumber + 1 );
    }
  };

  validateGeneratedNumber(1);
};