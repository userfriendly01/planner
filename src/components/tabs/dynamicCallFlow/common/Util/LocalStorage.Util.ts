export function dataFromLocalStorageHasExpired(key: string, timeToLive = 86400000): boolean {
  const lastCachedDate = localStorage.getItem(key.concat("_lastCachedDate"));

  return lastCachedDate ? new Date().getTime() - new Date(lastCachedDate).getTime() > timeToLive : true;
}

export function retrieveDataFromLocalStorage<DataType>(key: string, timeToLive = 86400000): DataType {
  const rawData = localStorage.getItem(key);
  const data: DataType = rawData ? JSON.parse(rawData) as DataType : {} as DataType;

  return dataFromLocalStorageHasExpired(key, timeToLive) ? undefined : data;
}