import { verifyToken } from '../services/authService.js';
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startswith('Bearer ')) {
    return res.status(401).json({
      success: false, error: 'No token provided'
    });
  }
  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
  req.user = decoded;

}