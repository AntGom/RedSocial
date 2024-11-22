import PropTypes from "prop-types";
import ProfileImage from "./ProfileImage";
import ProfileActions from "./ProfileActions";
import ProfileStats from "./ProfileStats";
import BioSection from "./BioSection";

const HeaderProfile = ({ user, auth, counters, iFollow, setIFollow, token }) => (
  <header className="w-full h-auto mt-2 mb-4 p-4 bg-white shadow-xl border-2 border-red-600 rounded-lg">
    <div className="flex flex-col">
      {/* Nombre y publicaciones */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {user.name} {user.surname}
        </h2>
        <p className="text-sm font-semibold text-red-600">{counters.publications || 0} Publicaciones</p>
      </div>

      {/* Imagen y acciones */}
      <div className="flex items-end justify-between bg-gray-100 rounded-lg">
        <ProfileImage user={user} />
        <ProfileActions
          user={user}
          auth={auth}
          iFollow={iFollow}
          setIFollow={setIFollow}
          token={token}
        />
      </div>

      {/* Biografía */}
      <BioSection user={user} />

      {/* Contadores */}
      <ProfileStats user={user} counters={counters} />
    </div>
  </header>
);

HeaderProfile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  auth: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  counters: PropTypes.shape({
    publications: PropTypes.number,
    following: PropTypes.number,
    followers: PropTypes.number,
  }).isRequired,
  iFollow: PropTypes.bool,
  setIFollow: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default HeaderProfile;
