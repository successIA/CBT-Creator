const hasAnyNonEmptyItem = errors => {
  return !Object.values(errors).some(error => error);
};

export default hasAnyNonEmptyItem;
