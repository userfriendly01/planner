import { SearchParams } from "usermanagement/ExtensionSearchParams";
import { logger } from "utils/logger";

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

export const generateExtension = (workers: any[]) => {
  const maxAttempts = 5;

  const validateGeneratedNumber = async (attemptNumber: number): Promise<any> => {
    const extension = pickANumber();
    const validExtension = !workers.some(w => {
      w.attributes.extension === extension.toString();
    });
    if(validExtension){
      return Promise.resolve(extension);
    } else if(attemptNumber === maxAttempts) {
      logger.log("Extension Max number reached");
      return Promise.reject("Unable to generate extension");
    } else {
      return validateGeneratedNumber(attemptNumber + 1 );
    }
  };

  return validateGeneratedNumber(1);
};