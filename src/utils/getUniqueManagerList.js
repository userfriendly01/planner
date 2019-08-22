// https://codeburst.io/javascript-array-distinct-5edc93501dc4 really good read.
export const getUniqueManagerList = workersArray => {
  if (workersArray && workersArray.length !== 0) {
    const result = [];
    const map = new Map();
    for (const worker of workersArray) {
      if (!map.has(worker.attributes.manager_n_number) && worker.attributes.manager_n_number !== undefined) {
        map.set(worker.attributes.manager_n_number, true);
        result.push({
          manager_first_name: worker.attributes.manager_first_name,
          manager_last_name: worker.attributes.manager_last_name,
          manager_n_number: worker.attributes.manager_n_number
        });
      }
    }
    return result;
  } else {
    return [];
  }
};
