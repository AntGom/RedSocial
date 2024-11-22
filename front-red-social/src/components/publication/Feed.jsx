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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-2">

        <button
          className="font-semibold border-2 border-red-600 p-2 rounded-xl hover:scale-105 transition-all"
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
