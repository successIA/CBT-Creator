const attributeValidator = (obj, attr, validator) => {
  return attr in validator ? validator[attr](obj[attr]) : null;
};

export default attributeValidator;
