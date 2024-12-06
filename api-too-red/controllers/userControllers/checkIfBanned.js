import MESSAGES from "../../services/messages.js";

const checkIfBanned = async (req, res) => {
  try {
    const status = req.user.isBanned ? "banned" : "active";

    return res.status(200).json({ status });
  } catch (error) {
    console.error("Error en checkIfBanned:", error.message);
    return res.status(500).json({ status: "error", message: MESSAGES.GENERAL.SERVER_ERROR });
  }
};

export default checkIfBanned;
