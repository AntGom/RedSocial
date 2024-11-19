import moment from "moment";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Generar token
const generateToken = (user) => {
   const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    created_at: moment().unix(), 
    iat: moment().unix(),
    exp: moment().add(30, "days").unix()
   }

   return jwt.sign(payload, process.env.JWT_SECRET);
};

export { generateToken };