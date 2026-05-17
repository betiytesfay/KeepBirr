import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}
export const comparePassword = async (plainPassword, hashPasword) => {
  return await bcrypt.compare(plainPassword, hashPasword)
}
export const generateToken = (userId, phoneNumber) => {
  return jwt.sign({ userId, phoneNumber }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  }
  catch (error) {
    return null;
  }
}