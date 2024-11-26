import PropTypes from "prop-types";
import { Global } from "../../../helpers/Global";

import {
  WrenchScrewdriverIcon,
  UserPlusIcon,
  UserMinusIcon,
} from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

const ProfileActions = ({ user, auth, iFollow, setIFollow, token }) => {
  const follow = async () => {
    if (!user._id) return; // Verificación añadida
    const request = await fetch(`${Global.url}follow/save`, {
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
      `${Global.url}follow/unfollow/${user._id}`,
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
    <section className="flex items-center mr-8 mb-3">
      {user._id === auth._id ? (
        <NavLink to="/social/config">
          <button className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10">
            <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
            Editar perfil
          </button>
        </NavLink>
      ) : (
        <button
          onClick={() => (iFollow ? unFollow() : follow())}
          className={` ${
            iFollow
              ? "flex items-center justify-center bg-white border-2 text-red-600 border-gray-900 font-semibold rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-44 h-10"
              : "flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10"
          }`}
        >
          {iFollow ? (
            <>
              <UserMinusIcon className="w-5 h-5 mr-2 text-red-600" />
              Dejar de seguir
            </>
          ) : (
            <>
              <UserPlusIcon className="w-5 h-5 mr-2 " />
              Seguir
            </>
          )}
        </button>
      )}
    </section>
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
