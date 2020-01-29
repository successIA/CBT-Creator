const getFirstNonNullOrFail = messages => {
  let msg = "";
  messages.forEach(val => {
    if (!msg && typeof val === "string" && val.trim().length) msg = val;
  });
  if (!msg)
    throw Error("The messages array conatins only null or empty values");
  return msg;
};

const getFirstMessage = messages => {
  let msg = "";
  if (messages && Array.isArray(messages) && messages.length) {
    msg = getFirstNonNullOrFail(messages);
  } else if (messages === Object(messages) && Object.values(messages).length) {
    msg = getFirstNonNullOrFail(Object.values(messages));
  } else if (typeof messages === "string") {
    msg = messages;
  } else {
    throw Error("messages can only be a non-empty array, object or string");
  }
  return msg;
};

export default getFirstMessage;
