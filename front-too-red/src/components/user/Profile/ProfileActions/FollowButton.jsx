import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import { Global } from "../../../../helpers/Global";

const FollowButton = ({ userId, iFollow, setIFollow, token, showToastMessage }) => {
  const follow = async () => {
    try {
      const response = await fetch(`${Global.url}follow/save`, {
        method: "POST",
        body: JSON.stringify({ followed: userId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setIFollow(true);
        showToastMessage("¡Ahora sigues a este usuario!", "success");
      } else {
        showToastMessage(data.message || "Error al seguir al usuario", "error");
      }
    } catch (error) {
      showToastMessage(error.message ||"Error de conexión. Inténtalo más tarde.", "error");
    }
  };

  const unFollow = async () => {
    try {
      const response = await fetch(`${Global.url}follow/unfollow/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setIFollow(false);
        showToastMessage("Has dejado de seguir a este usuario.", "success");
      } else {
        showToastMessage(data.message || "Error al dejar de seguir al usuario", "error");
      }
    } catch (error) {
      showToastMessage(error.message ||"Error de conexión. Inténtalo más tarde.", "error");
    }
  };

  return (
    <button
      onClick={iFollow ? unFollow : follow}
      className={`flex items-center justify-center bg-white border-2 ${
        iFollow ? "text-red-600 border-gray-900" : "text-gray-900 border-red-600"
      } font-semibold px-1 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10`}
    >
      {iFollow ? (
        <>
          <UserMinusIcon className="w-5 h-5 mr-2 text-red-600" />
          Dejar de seguir
        </>
      ) : (
        <>
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Seguir
        </>
      )}
    </button>
  );
};

FollowButton.propTypes = {
  userId: PropTypes.string.isRequired,
  iFollow: PropTypes.bool.isRequired,
  setIFollow: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  showToastMessage: PropTypes.func.isRequired,
};

export default FollowButton;
