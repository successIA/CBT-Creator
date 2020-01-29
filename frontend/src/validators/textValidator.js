const textValidator = (attrName, objectStr, errorMsg = null) => {
  if ((!attrName || !objectStr) && !errorMsg) {
    throw Error(
      "You must provide both either errorMsg or the attrName and objectStr"
    );
  }
  const validateAttr = attr => {
    if (!errorMsg)
      errorMsg = `The ${attrName} of the ${objectStr} is required.`;
    return !attr.trim().length ? errorMsg : null;
  };
  const validator = {
    [attrName]: validateAttr
  };
  return validator;
};

export default textValidator;
