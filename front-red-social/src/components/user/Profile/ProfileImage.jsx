import PropTypes from "prop-types";
import avatar from "../../../assets/img/user.png";
import { Global } from "../../../helpers/Global";

const ProfileImage = ({ user }) => (
  <div className="relative flex-shrink-0">
    <img
      src={
        user.image && user.image !== "default.png"
          ? `${Global.url}user/avatar/${user.image}`
          : avatar
      }
      className="w-28 h-28 ml-2 border-4 border-white rounded-full object-cover transition-all duration-300 hover:scale-110"
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
