import PropTypes from "prop-types";
import PublicationCard from "./PublicationCard/PublicationCard";

const PublicationList = ({ publications, getPublications, page, setPage, more }) => {
  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    getPublications(next);
  };

  return (
    <div className="space-y-7 mb-4">
      {publications.map((publication) => (
        <PublicationCard
          key={publication._id}
          publication={publication}
          getPublications={getPublications}
        />
      ))}

      {more && (
        <div className="text-center mt-8">
          <button
            onClick={nextPage}
            className="text-gray-900 font-bold border-2 border-red-600 p-2 rounded-lg hover:scale-105 transition-all mb-6"
          >
            Ver más publicaciones
          </button>
        </div>
      )}
    </div>
  );
};

PublicationList.propTypes = {
  publications: PropTypes.array.isRequired,
  getPublications: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  more: PropTypes.bool.isRequired,
};

export default PublicationList;
