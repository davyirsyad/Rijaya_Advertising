import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Hanya membuat dan mengembalikan string token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;