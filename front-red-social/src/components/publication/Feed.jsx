/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import PublicationList from "../publication/PublicationList";

const Feed = () => {
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getPublications(page, page === 1);
  }, [page]);

  const getPublications = async (actualPage = 1, showNews = false) => {
    if (showNews) {
      setPublications([]);
      setPage(1);
      actualPage = 1;
    }
    try {
      const request = await fetch(
        `${Global.url}publication/feed/${actualPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = await request.json();

      if (data.status === "success") {
        const newPublications =
          actualPage === 1
            ? data.posts || []
            : [...publications, ...(data.posts || [])];

        setPublications(newPublications);

        if (
          newPublications.length >= data.total ||
          data.totalPages <= actualPage
        ) {
          setMore(false);
        }
      } else {
        console.error("Error en la respuesta de la API:", data);
      }
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Timeline
        </h1>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-3xl shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => getPublications(1, true)}
        >
          Mostrar nuevas
        </button>
      </header>

      {publications.length === 0 ? (
        <div>
          <h1>NO HAY PUBLICACIONES PARA MOSTRAR</h1>.
        </div>
      ) : (
        <PublicationList
          publications={publications}
          page={page}
          setPage={setPage}
          more={more}
          setMore={setMore}
          getPublications={getPublications}
        />
      )}
    </div>
  );
};

export default Feed;
