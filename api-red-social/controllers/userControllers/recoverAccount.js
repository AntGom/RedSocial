import jwt from "jsonwebtoken";
import User from '../../models/userModel.js';

const secretKey = process.env.JWT_SECRET;

const recoverAccount = async (req, res) => {
    const { token } = req.body;
  
    try {
      const decoded = jwt.verify(token, secretKey);
      const { email, isDeleted } = decoded; // Extraer isDeleted del token
  
      console.log(`Decoded email: ${email}`);  // Verifica que el email es el esperado
      console.log(`Decoded isDeleted: ${isDeleted}`);  // Verifica que el estado de isDeleted es correcto

      const user = await User.findOne({ email, isDeleted: true });  
      console.log(`User found: ${user}`);  // Verifica que el usuario es encontrado correctamente

      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado o no está marcado como eliminado.' });
      }
  
      console.log(`User isDeleted value: ${user.isDeleted}`); // Verificar el valor de isDeleted en la base de datos
  
      if (!user.isDeleted || !isDeleted) { // Verificar que la cuenta está eliminada
        return res.status(400).json({ message: 'Token inválido o cuenta ya activa.' });
      }
  
      // Reactivar la cuenta
      user.isDeleted = false;
      await user.save();
  
      res.status(200).json({ message: 'Cuenta recuperada exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Token inválido o expirado.' });
    }
  };
  

export default recoverAccount;
