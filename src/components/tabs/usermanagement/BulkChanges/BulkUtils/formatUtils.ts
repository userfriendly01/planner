/**
 * Formats a string to Proper Case;
 * @param field Field to format
 */
export const formatErrorMessage = (err: any) => {
  try {
    if(err?.response?.data){
      return JSON.stringify(err.response.data);
    } else if(err?.response) {
      return JSON.stringify(err.response);
    } else if(err?.message){
      return err.message.toString();
    } else {
      return err.toString();
    }
  } catch(error){
    return err;
  }
};

/**
 * Formats a string to Proper Case;
 * @param field Field to format
 */
export const toProperCase = (field: any) => {
  const fieldArray = field.split(" ").map((w: string) => {
    const word = w.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return fieldArray.join(" ");
};

/**
 * When doing equality checks, this takes in a field param and a required type and makes sure that field
 * is compatible to that type. 
 * 
 * If it requires a string, it converts it to a string if necessary and trims off any extra space and 
 * transforms it  to lowercase to ensure we're always comparing like formats
 * 
 * If it requires a number, it makes sure to parse it into an int if possible
 * @param field Field to validate and clean
 * @param requiredType What type the field should be in
 */
export const cleanupField = (field: any, requiredType: string) => {
  if(field){
    switch(requiredType){
      case "string":
        if(typeof field === "string"){
          return field.trim().toLowerCase();
        } else {
          return field.toString().trim().toLowerCase();
        }

      case "number":
        if(typeof field === "number"){
          return field;
        } else {
          const isNotNum: boolean = isNaN(field as any);
          if(isNotNum){
            return field;
          } else {
            return parseInt(field);
          }
        }
      default:
        return field;
    }
  } else {
    return field;
  }
};

// returns a date in YYYY-MM-DD format
export const formatDateFromExcelDate = (excelDate: number) => {
  const date = new Date(Date.UTC(0, 0, excelDate));
  console.log(date, "date")
  let day: string | number = date.getDate();
  let month: string | number = date.getMonth() + 1;
  const year = date.getFullYear();
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error("Invalid date");
  }

  if (day.toString().length === 1) {
    day = `0${day}`;
  }

  if (month.toString().length === 1) {
    month = `0${month}`;
  }

  return `${year}-${month}-${day}`;
};