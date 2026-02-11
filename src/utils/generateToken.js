import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    userType: user.userType,
  };

  const secret = process.env.JWT_SECRET || 'devsecret';
  const expiresIn = '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

