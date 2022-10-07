import crypto from "crypto";

const generateRef = (stringLen = 10) => {
  let rand = crypto.randomBytes(stringLen);
  const randString = rand.toString("hex");

  return randString;
};

export default generateRef;
