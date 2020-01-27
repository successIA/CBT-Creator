export const getArrayByObjAndCount = (obj, count = 5) => {
  const array = [];
  for (let index = 0; index < count; index++) {
    array.push({ ...obj });
  }
  return [...array];
};
