import textValidator from "./textValidator";

const validateChoices = choices => {
  if (!choices.length) return "Minimum of two vaild choices are required";
  let errorMsg = null;
  let validBodyCount = 0;
  let hasAnswerWithoutBody = false;
  let hasAnAnswer = false;
  choices.map((choice, index, array) => {
    if (choice.body.trim().length) ++validBodyCount;
    if (choice.is_answer && !choice.body.trim().length)
      hasAnswerWithoutBody = true;
    if (choice.is_answer) hasAnAnswer = true;
    if (index === array.length - 1) {
      if (validBodyCount < 2)
        errorMsg = "Minimum of two vaild choices are required";
      else if (hasAnswerWithoutBody)
        errorMsg = "The correct choice must have a label";
      else if (!hasAnAnswer) errorMsg = "You must select a correct answer";
    }
    return choice;
  });
  return errorMsg;
};

const questionValidator = {
  ...textValidator("body", "question"),
  choices: validateChoices
};

export default questionValidator;
