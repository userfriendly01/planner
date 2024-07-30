export function dataFromLocalStorageHasExpired(fieldOptionsCacheKey: string, timeToLive = 86400000): boolean {
  const lastCachedDate = localStorage.getItem(fieldOptionsCacheKey.concat("_lastCachedDate"));

  return lastCachedDate ? new Date().getTime() - new Date(lastCachedDate).getTime() > timeToLive : true;
}

export function retrieveDataFromLocalStorage<DataType>(fieldOptionsCacheKey: string, timeToLive = 86400000): DataType {
  const rawData = localStorage.getItem(fieldOptionsCacheKey);
  const data: DataType = rawData ? JSON.parse(rawData) as DataType : {} as DataType;

  return dataFromLocalStorageHasExpired ? undefined : data;
}