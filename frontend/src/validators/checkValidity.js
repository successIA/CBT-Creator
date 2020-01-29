import attributeValidator from "./attributeValidator";

const checkValidity = (obj, validator) => {
  const errors = {};
  Object.keys(obj).reduce((errors, attr) => {
    errors[attr] = attributeValidator(obj, attr, validator);
    return errors;
  }, errors);
  return errors;
};

export default checkValidity;
