import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import BadRequestError from "./bad-request-error.js";

const generateSalt = async () => {
  return await bcrypt.genSalt();
};

const generatePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

const validatePassword = async (enteredPassword, savedPassword, salt) => {
  // implement logic to validate password
  return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

const generateToken = async (payload) => {
  try {
    return await jsonwebtoken.sign(payload, process.env.APP_SECRET, {
      expiresIn: "30 days",
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const validateSignature = async (req, res, next) => {
  let token;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ")[1]
  ) {
    token = req.headers["authorization"].split(" ")[1];
    token = await jsonwebtoken.verify(token, process.env.APP_SECRET);
    req.user = token;
    next();
  } else {
    return res.status(401).send({ success: false, message: "Access denied" });
  }
};

export {
  generateSalt,
  generatePassword,
  validatePassword,
  generateToken,
  validateSignature,
};
