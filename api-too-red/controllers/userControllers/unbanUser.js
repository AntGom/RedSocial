import User from "../../models/userModel.js";
import MESSAGES from "../../services/messages.js";

const unbanUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ status: "error", message: MESSAGES.AUTH.UNAUTHORIZED });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ status: "error", message: MESSAGES.USER.NOT_FOUND });
    }

    if (!user.isBanned) {
      return res.status(400).send({ status: "error", message: MESSAGES.USER.ALREADY_UNBANNED });
    }

    user.isBanned = false;
    await user.save();

    return res.status(200).send({ status: "success", message: MESSAGES.USER.UNBANNED_SUCCESS });
  } catch (error) {
    return res.status(500).send({ status: "error", message: MESSAGES.GENERAL.SERVER_ERROR });
  }
};

export default unbanUser;
