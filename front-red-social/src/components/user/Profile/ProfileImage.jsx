import PropTypes from "prop-types";
import avatar from "../../../assets/img/user.png";

const ProfileImage = ({ user }) => (
  <div className="relative flex-shrink-0">
    <img
      src={
        user.image && user.image !== "default.png"
          ? `http://localhost:3900/api/user/avatar/${user.image}`
          : avatar
      }
      className="w-28 h-28 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer ml-4"
      alt={`Foto de perfil de ${user.name}`}
    />
  </div>
);

ProfileImage.propTypes = {
  user: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileImage;
