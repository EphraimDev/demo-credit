import jwt from "jsonwebtoken";

let { JWT_SECRET_KEY } = process.env;

export interface JWTPayloadArgType {
  id: number;
  phone_number: string;
}

const AccessToken = async (user: JWTPayloadArgType) => {
  const payload = {
    id: user.id,
    phone_number: user.phone_number,
    time: new Date(),
  };
  if (!JWT_SECRET_KEY) return null;
  const token = jwt.sign(payload, <string>JWT_SECRET_KEY);

  return token;
};

export default AccessToken;
