import jwt from "jsonwebtoken";

let { JWT_SECRET_KEY } = process.env;

export interface JWTPayloadArgType {
  id: number;
  email: string;
}

const AccessToken = async (user: JWTPayloadArgType) => {
  const payload = {
    id: user.id,
    email: user.email,
    time: new Date(),
  };
  if (!JWT_SECRET_KEY) return null;
  const token = jwt.sign(payload, <string>JWT_SECRET_KEY);

  return token;
};

export default AccessToken;
