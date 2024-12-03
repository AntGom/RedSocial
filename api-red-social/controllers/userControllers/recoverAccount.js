import User from "../../models/userModel.js";
import Publication from "../../models/publicationModel.js";
import Follow from "../../models/followModel.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

const recoverAccount = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, secretKey);
    const { email, isDeleted } = decoded;

    const user = await User.findOne({ email, isDeleted: true });

    if (!user) {
      return res
        .status(400)
        .json({
          message: "Usuario no encontrado o no está marcado como eliminado.",
        });
    }

    if (!user.isDeleted || !isDeleted) {
      return res
        .status(400)
        .json({ message: "Token inválido o cuenta ya activa." });
    }

    //Reactivar la cuenta
    user.isDeleted = false;
    await user.save();

    //Recuperar publicaciones+follows
    const publications = await Publication.find({
      user: user._id,
      isDeleted: true,
    });
    const follows = await Follow.find({
      $or: [{ user: user._id }, { followed: user._id }],
      isDeleted: true,
    });

    //Reactivar publicaciones+follows
    await Promise.all([
      Publication.updateMany(
        { _id: { $in: publications.map((pub) => pub._id) } },
        { isDeleted: false }
      ),
      Follow.updateMany(
        { _id: { $in: follows.map((f) => f._id) } },
        { isDeleted: false }
      ),
    ]);

    res.status(200).json({ message: "Cuenta recuperada exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token inválido o expirado." });
  }
};

export default recoverAccount;
