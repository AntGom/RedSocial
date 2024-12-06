import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';

const checkIfBanned = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Buscar al usuario en la base de datos
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Comprobar si el usuario está baneado usando el campo isBanned
    if (user.isBanned) {
      return res.status(403).json({ status: 'banned' });
    }

    // Si el usuario no está baneado
    return res.status(200).json({ status: 'active' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error verifying user status' });
  }
};

export default checkIfBanned;
