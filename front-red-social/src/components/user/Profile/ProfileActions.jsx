import PropTypes from "prop-types";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

const ProfileActions = ({ user, auth, iFollow, setIFollow, token }) => {
  const follow = async () => {
    if (!user._id) return; // Verificación añadida
    const request = await fetch("http://localhost:3900/api/follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: user._id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();
    if (data.status === "success") {
      setIFollow(true);
    }
  };

  const unFollow = async () => {
    if (!user._id) return; // Verificación añadida
    const request = await fetch(
      `http://localhost:3900/api/follow/unfollow/${user._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await request.json();
    if (data.status === "success") {
      setIFollow(false);
    }
  };

  return (
    <div className="flex items-center mr-8 mb-3">
      {user._id === auth._id ? (
        <button className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all w-40 h-10">
          <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
          Editar perfil
        </button>
      ) : (
        <button
          onClick={() => (iFollow ? unFollow() : follow())}
          className={`flex items-center justify-center px-4 py-2 rounded-lg shadow-md transition-all w-40 h-10 ${
            iFollow
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {iFollow ? "Dejar de seguir" : "Seguir"}
        </button>
      )}
    </div>
  );
};

ProfileActions.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  iFollow: PropTypes.bool,
  setIFollow: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default ProfileActions;
