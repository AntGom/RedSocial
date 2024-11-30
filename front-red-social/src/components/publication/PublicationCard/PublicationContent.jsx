import PropTypes from "prop-types";
import { Global } from "../../../helpers/Global";

const PublicationContent = ({ text, file, onViewImage }) => (
  <div>
    <p className="mt-4 text-gray-800">{text}</p>
    {file && (
      <div className="mt-4 relative">
        <img
          src={`${Global.url}publication/media/${file}`}
          alt="Imagen de la publicación"
          className="w-full max-h-96 rounded-lg object-cover cursor-pointer"
          style={{ aspectRatio: "16/9" }}
          onClick={() => onViewImage(file)}
        />
      </div>
    )}
  </div>
);

PublicationContent.propTypes = {
  text: PropTypes.string.isRequired,
  file: PropTypes.string,
  onViewImage: PropTypes.func.isRequired,
};

export default PublicationContent;
